const capitalize = (s) => s.charAt(0).toUpperCase() + s.substring(1);

export default function parseItem(item) {
  const newItem = {
    id: item.id,
    type: capitalize(item.type),
    image_id: item.image ? item.image.id : null,
    sound_id: item.sound ? item.sound.id : null,
    speaker_role: item.speaker_role ? item.speaker_role.toUpperCase() : null,
    l1_text: item.display_language_text || '',
    l2_text: item.learn_language_text || '',
    info_text: item.info_text ? item.info_text : ''
  };

  if ('nonInteractive' in item) {
    newItem.nonInteractive = item.nonInteractive;
  }

  return newItem;
}
