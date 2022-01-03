const babbelUrlRegex = /^https?:\/\/([^.]+\.babbel\.(dev|cn|com|test)(\/|$)|lesson-player.spa:.+|localhost:.+)/;

export default (url) => babbelUrlRegex.test(url) ? url : null;
