import dayjs from 'dayjs';
import { assign, has, omit } from 'lodash';
import Audio from '../utils/audio';

let audio = null;

export default {
  data() {
    return {
      audioSrc: '', // 当前播放音频src
      currentTime: 0, // 当前进度(s)
      duration: 0, // 总时长
      currentFormart: '00:00',
      durationFormart: '00:00',
      currentDownFormart: '00:00',
      paused: true, // 是否处于暂停或停止状态
      isProgress: false,
    };
  },
  onShow() {
    this.initAudio();
  },
  methods: {
    // 初始化音频
    initAudio() {
      const init = () => {
        const { duration, paused, currentTime, src: audioSrc } = audio;

        const data = assign({
          audioSrc,
          duration,
          currentTime,
          paused,
        }, duration && {
          durationFormart: dayjs(duration * 1000).format('mm:ss'),
        }, currentTime && {
          currentFormart: dayjs(currentTime * 1000).format('mm:ss'),
        }, duration && currentTime && {
          currentDownFormart: dayjs((duration - currentTime) * 1000).format('mm:ss'),
        });

        if (currentTime > duration) {
          data.currentDownFormart = '00:00';
        }

        Object.assign(this, data);
      };

      audio = new Audio(init, () => {
        const { currentTime, duration } = audio;

        let data = {
          currentTime,
          currentFormart: dayjs(currentTime * 1000).format('mm:ss'),
          currentDownFormart: dayjs((duration - currentTime) * 1000).format('mm:ss'),
        };

        if (currentTime > duration) {
          data.currentDownFormart = '00:00';
        }

        // 拖拽修改进度条
        if (has(this, 'isProgress') && this.isProgress) {
          data = omit(data, 'currentTime');
        }

        Object.assign(this, data);
      });

      init();
    },
    seek(num) {
      audio.seek(num);
    },
    playAudio(url, name) {
      if (url !== this.audioSrc) {
        audio.stop();
      }
      audio.play(url, name);
    },
    pauseAudio() {
      audio.pause();
    },
  },
};
