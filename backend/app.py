import os
import cv2
import numpy as np
import mediapipe as mp
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# 初始化 MediaPipe Pose 模型
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=True, 
    model_complexity=2, # 使用精度最高的模型(2)，能更好地应对远距离、小目标和复杂姿态
    enable_segmentation=False, 
    min_detection_confidence=0.2 # 调低初次检测阈值，更容易抓取到较小或不清晰的人物
)

def calculate_angle(a, b, c):
    """计算三点构成的夹角(度数)"""
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    
    if angle > 180.0:
        angle = 360 - angle
        
    return angle

def process_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        return None
        
    # OpenCV读取是BGR，需要转换成RGB给MediaPipe使用
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(image_rgb)
    
    # 没检测出哪怕一个关节点说明无法识别到人体
    if not results.pose_landmarks:
        return None
        
    h, w, _ = image.shape
    landmarks = results.pose_landmarks.landmark
    
    # 提取所有关键点的真实像素坐标
    points = []
    for idx, landmark in enumerate(landmarks):
        points.append({
            'id': idx,
            'x': int(landmark.x * w),
            'y': int(landmark.y * h),
            'z': landmark.z,
            'visibility': landmark.visibility
        })
        
    # 使用 MediaPipe 原生定义好的骨架连接
    connections = []
    for connection in mp_pose.POSE_CONNECTIONS:
        connections.append([connection[0], connection[1]])
        
    # ========== 动作分析评价模块 ==========
    jointsAnalysis = []
    score = 100
    
    # 获取特定索引点的像素坐标
    def get_coords(idx):
        return [landmarks[idx].x, landmarks[idx].y]
    
    # MediaPipe 索引参考：
    # 11:左肩, 13:左肘, 15:左腕
    # 12:右肩, 14:右肘, 16:右腕
    # 23:左髋, 25:左膝, 27:左踝
    # 24:右髋, 26:右膝, 28:右踝
    
    left_arm_angle = calculate_angle(get_coords(11), get_coords(13), get_coords(15))
    if left_arm_angle > 150:
        jointsAnalysis.append({'name': '左臂伸展', 'status': '标准', 'desc': f'左臂伸张充分 (角度: {int(left_arm_angle)}°)'})
    else:
        jointsAnalysis.append({'name': '左臂伸展', 'status': '不达标', 'desc': f'左手臂过度弯曲，建议发力打直 (角度: {int(left_arm_angle)}°)'})
        score -= min(10, int(150 - left_arm_angle) * 0.5)
        
    right_arm_angle = calculate_angle(get_coords(12), get_coords(14), get_coords(16))
    if right_arm_angle > 150:
        jointsAnalysis.append({'name': '右臂伸展', 'status': '标准', 'desc': f'右臂伸张充分 (角度: {int(right_arm_angle)}°)'})
    else:
        jointsAnalysis.append({'name': '右臂伸展', 'status': '不达标', 'desc': f'右手臂不够直，建议进一步向外发力伸展 (角度: {int(right_arm_angle)}°)'})
        score -= min(10, int(150 - right_arm_angle) * 0.5)

    left_leg_angle = calculate_angle(get_coords(23), get_coords(25), get_coords(27))
    if left_leg_angle > 150:
        jointsAnalysis.append({'name': '左腿伸开', 'status': '标准', 'desc': f'左腿伸开良好 (角度: {int(left_leg_angle)}°)'})
    else:
        jointsAnalysis.append({'name': '左腿微曲', 'status': '标准', 'desc': f'左腿重心下沉微曲 (角度: {int(left_leg_angle)}°)'})
        
    right_leg_angle = calculate_angle(get_coords(24), get_coords(26), get_coords(28))
    if right_leg_angle > 150:
        jointsAnalysis.append({'name': '右腿伸开', 'status': '标准', 'desc': f'右腿伸开良好 (角度: {int(right_leg_angle)}°)'})
    else:
        jointsAnalysis.append({'name': '右腿微曲', 'status': '标准', 'desc': f'右腿重心下沉微曲 (角度: {int(right_leg_angle)}°)'})

    # 防止分数过低或超过100
    score = max(0, min(100, int(score)))

    return {
        'score': score,
        'postureLevel': '优秀' if score >= 90 else ('良好' if score >= 80 else '提升空间很大'),
        'coordination': '很协调' if score >= 85 else '需加强核心控制',
        'keypoints': {
            'points': points,
            'connections': connections,
            'originalWidth': w,
            'originalHeight': h
        },
        'jointsAnalysis': jointsAnalysis,
        'suggestion': '这是基于 MediaPipe 真实AI模型推理后的报告！请您根据详细身体关节诊断进行发力调整。'
    }

@app.route('/api/analyze_pose', methods=['POST'])
def analyze_pose():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400
        
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # 将接收的保存图片丢给AI模型处理
        result = process_image(filepath)
        
        # 处理完毕后清理本地留存文件
        if os.path.exists(filepath):
            os.remove(filepath)
            
        if result is None:
            return jsonify({'error': '未在画面中检测到足够清晰的人体姿态，请换张照片再试'}), 400
            
        return jsonify(result)

@app.route('/', methods=['GET'])
def index():
    return "<h1>您的动作分析 AI 后端已经成功运行！</h1><p>端口监听正常。请返回微信小程序继续点击上传测试。</p>"
        
if __name__ == '__main__':
    # 绑定0.0.0.0可以让同一个Wifi局域网下的手机真机扫码也能访问这个后台
    app.run(host='0.0.0.0', port=5000, debug=True)
