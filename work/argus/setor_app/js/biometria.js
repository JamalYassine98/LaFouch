// ARGUS · setor App · a biometria no simulador: o plugin nativo responde "tem digital" e "confirmado" (no APK é a digital de verdade)
(()=>{const P={checkBiometry:()=>Promise.resolve({isAvailable:true,biometryType:3,strongBiometryIsAvailable:true}),internalAuthenticate:()=>Promise.resolve({}),authenticate:()=>Promise.resolve({})};
 window.Capacitor=Object.assign(window.Capacitor||{},{Plugins:Object.assign((window.Capacitor&&window.Capacitor.Plugins)||{},{BiometricAuthNative:P})})})()
