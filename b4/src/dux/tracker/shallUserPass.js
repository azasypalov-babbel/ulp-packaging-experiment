// Only allow odd user uuid's
export const shallUserPass = (uuid) => {
  return uuid && parseInt(uuid.slice(-1), 16) % 2 !== 0;
};
