# 字幕出字时刻相对拍点的相位：均匀分布=不卡拍；集中在 0 附近=卡拍
import numpy as np
cnt=np.load('D1细拆/subcnt.npy'); b=np.loadtxt('beats.txt')
on=[i/10 for i in range(1,len(cnt)) if cnt[i-1]<60 and cnt[i]>=60]
ph=[]
for t in on:
    k=np.searchsorted(b,t)-1
    if 0<=k<len(b)-1: ph.append((t-b[k])/(b[k+1]-b[k]))
ph=np.array(ph); h,_=np.histogram(ph,bins=4,range=(0,1))
print(len(on),'次出字；相位四分箱',h, '（拍上±1/8 的比例 %.2f，随机 0.25）'%np.mean((ph<.125)|(ph>.875)))
