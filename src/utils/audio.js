import { isNumber } from 'lodash';

class Audio {
  // 总音频时长
  get duration() {
    return this.audio.duration;
  }

  // 音频播放状态
  get paused() {
    return this.audio.paused;
  }

  // 播放进度
  get currentTime() {
    return this.audio.currentTime;
  }

  // 播放音频的url
  get src() {
    return this.audio.src;
  }

  constructor(change, timeUpdate) {
    this.audio = wx.getBackgroundAudioManager();

    this.init(change, timeUpdate);
  }

  // 绑定监听
  init(change, timeUpdate) {
    const { audio } = this;
    // 音频进度更新事件
    audio.onTimeUpdate(timeUpdate);
    // 音频播放事件
    audio.onPlay(change);
    // 音频暂停事件
    audio.onPause(change);
    // 音频结束事件
    audio.onEnded(change);
    // 音频完成更改进度事件
    audio.onSeeked(change);
    // 监听背景音频停止事件
    audio.onStop(change);
    // 监听背景音频播放错误事件
    audio.onError(change);
  }

  // 播放
  play(_src, title) {
    const { src, audio } = this;
    if (src && src === _src) {
      audio.play();
      return;
    }
    audio.src = _src;
    audio.title = title || '南京文学客厅';
  }

  // 暂停
  pause() {
    this.audio.pause();
  }

  // 停止
  stop() {
    this.audio.stop();
  }

  seek(currentTime) {
    if (!isNumber(currentTime)) return;
    this.audio.seek(currentTime);
  }
}

export default Audio;
