declare global {
  namespace NodeJS {
    interface Global {
      express: any;
    }
  }
}
export default global;
