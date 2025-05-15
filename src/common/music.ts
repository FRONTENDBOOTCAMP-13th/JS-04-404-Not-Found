/**
 *
 * @param audio {HTMLAudioElement} 음악 소스가 담긴 audio 객체
 * @param loop {boolean} 반복 재생 여부
 * @returns
 */

export function allowMusic(audio: HTMLAudioElement, loop: boolean) {
  const musicPlay = localStorage.getItem('musicPlay');
  if (musicPlay === 'true') {
    if (loop === true) {
      return audio.play(), (audio.loop = true);
    } else {
      return audio.play(), (audio.loop = false);
    }
  } else {
    audio.pause();
  }
}
