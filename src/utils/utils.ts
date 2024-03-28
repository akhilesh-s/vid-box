export class Utils {
  static isBrowser() {
    return window !== undefined;
  }

  static getAssetPath(path: string) {
    return `http://commondatastorage.googleapis.com/gtv-videos-bucket/${path}`;
  }
}
