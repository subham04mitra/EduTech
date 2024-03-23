const CryptoJS=require('crypto-js')
const auth = {
    encrypt: (text, key = "poms-nic", fixedIV = null) => {
      let iv;
      if (fixedIV) {
        // Use provided fixed IV
        iv = CryptoJS.enc.Base64.parse(fixedIV);
      } else {
        // Generate a random IV
        iv = CryptoJS.lib.WordArray.random(16);
      }
      const cipherText = CryptoJS.AES.encrypt(text, key, { iv: iv });
      
      // Combine IV and ciphertext
      const encryptedData = iv.concat(cipherText.ciphertext);
  
      // Convert to Base64 string
      return encryptedData.toString(CryptoJS.enc.Base64);
    }
  };
  
  // Example usage:
  const plaintext = "Hello, world!";
  const key = "poms-nic";
  const fixedIV = "00000000000000000000000000000000"; // Example fixed IV (32 hex characters)
  
  const ciphertext1 = auth.encrypt(plaintext, key, fixedIV);
  console.log("Ciphertext 1:", ciphertext1);
  
  const ciphertext2 = auth.encrypt(plaintext, key, fixedIV);
  console.log("Ciphertext 2:", ciphertext2);
  