// グローバルスコープに1つだけ
const audioContext = new AudioContext()

const buffers: Record<string, AudioBuffer> = {}

export async function loadAudioBuffer(path: string): Promise<AudioBuffer> {
  if (buffers[path]) {
    return buffers[path]
  }
  const response = await fetch(path)
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  buffers[path] = audioBuffer
  return audioBuffer
}

export function playBuffer(
  buffer: AudioBuffer,
  callback: (ev: Event) => void
): AudioBufferSourceNode {
  const source = audioContext.createBufferSource()
  source.buffer = buffer
  source.onended = callback
  source.connect(audioContext.destination)
  source.start()
  return source
}
