export default function taskFromString(string, id = 0) {
  return {
    id: id,
    type: 'Task',
    image_id: 0,
    sound_id: null,
    speaker_role: null,
    l1_text: string,
    l2_text: '',
    info_text: ''
  };
}
