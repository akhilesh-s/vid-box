export class Utils {
  static isBrowser() {
    return typeof window !== "undefined";
  }

  static getAssetPath(path: string) {
    return `http://commondatastorage.googleapis.com/gtv-videos-bucket/${path}`;
  }
}
