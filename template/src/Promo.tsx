import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Html5Audio, staticFile } from "remotion";
import "./lib/fonts";
import { useTime } from "./lib/anim";
import { platformTransform, type Platform } from "./lib/platforms";
import { C } from "./lib/theme";
import { Example } from "./scenes/Example";

export type PromoProps = { withAudio: boolean; webMode?: boolean; platform?: Platform };

/** Every scene takes absolute time `t` in seconds and renders nothing outside its window in timing.json. */
export const Promo: React.FC<PromoProps> = ({ withAudio, webMode = false, platform = "douyin" }) => {
  const t = useTime();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* 多平台版本：内容层按平台缩放平移（references/平台规范.md）。有字幕的项目，字幕放在这一层里；
          PLATFORMS[platform].sub 有值时改放在这一层外面，按 sub 的位置单独摆 */}
      <AbsoluteFill style={{ transformOrigin: "540px 236px", transform: platformTransform(platform) }}>
        <Example t={t} />
      </AbsoluteFill>
      {withAudio &&
        (webMode ? (
          // @remotion/media 在浏览器跑不满帧时会重复排程音频块，叠成多重回音；网页版改用 <audio> 元素
          <Html5Audio src={staticFile("audio/mix.wav")} />
        ) : (
          <Audio src={staticFile("audio/mix.wav")} />
        ))}
    </AbsoluteFill>
  );
};
