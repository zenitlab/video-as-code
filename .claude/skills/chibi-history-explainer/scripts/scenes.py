# 换场：背景区（避开左上字幕）相隔 0.5 秒的差，峰值处为换场；同时打印峰值前后 0.1 秒的逐帧差看是硬切还是渐变
import sys, subprocess, numpy as np
raw=subprocess.run(['ffmpeg','-v','error','-i',sys.argv[1],'-vf','fps=10,crop=784:441:88:3,scale=196:110,format=gray','-f','rawvideo','-'],capture_output=True).stdout
F=np.frombuffer(raw,np.uint8).reshape(-1,110,196).astype(np.float32)
B=F[:,40:,:]   # 去掉上方字幕带
d5=np.array([np.abs(B[i+5]-B[i]).mean() for i in range(len(B)-5)])
d1=np.abs(np.diff(B,axis=0)).mean((1,2))
pk=[i for i in range(3,len(d5)-3) if d5[i]>14 and d5[i]==d5[i-3:i+4].max()]
for i in pk:
    seg=d1[i:i+6]; j=i+int(seg.argmax())
    kind='硬切' if seg.max()>0.7*seg.sum() else f'渐变约{(seg>seg.max()*0.25).sum()/10:.1f}s'
    print(f'{(i+2.5)/10:6.1f}s  幅度 {d5[i]:4.1f}  {kind}')
