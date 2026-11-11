# 动态统计：硬切数（相邻帧大跳变）、每秒画面变化量、完全静止帧比例
import sys, subprocess, numpy as np
for src in sys.argv[1:]:
    raw = subprocess.run(['ffmpeg','-v','error','-i',src,'-vf','fps=30,crop=iw*0.82:ih:iw*0.09:0,scale=160:90,format=gray','-f','rawvideo','-'],capture_output=True).stdout
    F = np.frombuffer(raw,np.uint8).reshape(-1,90,160).astype(np.float32); d = np.abs(np.diff(F,axis=0)).mean((1,2))
    cuts = [i for i in range(1,len(d)-1) if d[i] > 18 and d[i] > 4*max(d[i-1], d[i+1])]
    print(f'{src}: {len(F)/30:.0f}s  硬切 {len(cuts)}（每分钟 {len(cuts)/(len(F)/1800):.1f}）  帧差中位数 {np.median(d):.2f}  静止帧(<0.1) {np.mean(d<.1):.0%}  动态帧(>1) {np.mean(d>1):.0%}')
