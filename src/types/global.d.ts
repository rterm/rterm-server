declare global {
  namespace NodeJS {
    interface Global {
      express: any;
      passport: any;
    }
  }
}
export default global;
