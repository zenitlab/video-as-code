# 字幕切换时间：左上字幕区亮像素掩码，相邻稳定段比较
import sys, subprocess, numpy as np
src=sys.argv[1]
W,H=200,64
raw=subprocess.run(['ffmpeg','-v','error','-i',src,'-vf',f'fps=10,crop=400:128:118:28,scale={W}:{H},format=gray','-f','rawvideo','-'],capture_output=True).stdout
F=np.frombuffer(raw,np.uint8).reshape(-1,H,W)
M=(F>170)
cnt=M.sum((1,2))
# 新一句出现 = 亮像素数从高跌到低（清屏）或掩码大幅变化
d=np.array([ (M[i]^M[i-1]).sum() for i in range(1,len(M))])
ev=[]
for i in range(1,len(cnt)):
    if cnt[i-1]>150 and cnt[i]<cnt[i-1]*0.4: ev.append(i/10)
last=-9;out=[]
for t in ev:
    if t-last>1: out.append(t)
    last=t
print(len(out),'次清屏'); print(' '.join(f'{t:.1f}' for t in out))
iv=np.diff(out); print('句间隔 中位数 %.1fs 范围 %.1f-%.1f'%(np.median(iv),iv.min(),iv.max()))
np.save(sys.argv[2],cnt)
