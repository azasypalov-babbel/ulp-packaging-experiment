function itemFor(type, attributes = {}) {
  return {
    id: attributes.id || 0,
    type: type,
    image_id: attributes.image_id || null,
    sound_id: null,
    speaker_role: null,
    l1_text: attributes.l1_text || '',
    l2_text: '',
    info_text: ''
  };
}

export function titleItem(title) {
  return itemFor('title', { l1_text: title });
}

export function descriptionItem(description) {
  return itemFor('description', { l1_text: description });
}
