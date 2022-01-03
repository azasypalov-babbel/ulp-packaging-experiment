class NavigationService {
  reload() {
    window.location.reload();
  }
  assign(url) {
    window.location.assign(url);
  }
}

export default new NavigationService();
