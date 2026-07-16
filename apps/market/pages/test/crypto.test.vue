<template>
  <div>
    <h1>CRYPTO.TEST</h1>
  </div>
</template>

<script setup lang="ts">
/*import { onMounted } from 'vue'
import { AES } from '@petoman/crypto'

onMounted(async () => {
  const key = crypto.getRandomValues(new Uint8Array(32))

  const encrypted = await AES.encryptText(
      'hello petoman',
      key,
      1,
  )

  const decrypted = await AES.decryptText(
      encrypted,
      key,
  )

  console.log(encrypted)
  console.log(decrypted)
})*/

/////

/*import {
  X25519,
} from '@petoman/crypto';

// Alice
const alice =
    X25519.generateKeyPair();

// Bob
const bob =
    X25519.generateKeyPair();

// Alice computes shared secret
const aliceShared =
    X25519.computeSharedSecret(
        X25519.importKey(alice.privateKey),
        X25519.importKey(bob.publicKey),
    );

// Bob computes shared secret
const bobShared =
    X25519.computeSharedSecret(
        X25519.importKey(bob.privateKey),
        X25519.importKey(alice.publicKey),
    );

console.log(aliceShared);
console.log(bobShared);

console.log(
    'Equal:',
    JSON.stringify([...aliceShared]) === JSON.stringify([...bobShared]),
);*/


/*import {
  X25519,
  SessionKeyManager,
} from '@petoman/crypto';

// Alice
const alice =
    X25519.generateKeyPair();

// Bob
const bob =
    X25519.generateKeyPair();

// Shared Secret
const sharedA =
    X25519.computeSharedSecret(
        X25519.importKey(alice.privateKey),
        X25519.importKey(bob.publicKey),
    );

const sharedB =
    X25519.computeSharedSecret(
        X25519.importKey(bob.privateKey),
        X25519.importKey(alice.publicKey),
    );

// مشتق‌سازی کلید با یک Salt مشترک
const salt =
    crypto.getRandomValues(
        new Uint8Array(32),
    );

const sessionA =
    SessionKeyManager.deriveSessionKey(
        sharedA,
        'consultation-1',
        1,
        'device-alice',
        salt,
    );

const sessionB =
    SessionKeyManager.deriveSessionKey(
        sharedB,
        'consultation-1',
        1,
        'device-alice',
        salt,
    );

console.log(sessionA.key);
console.log(sessionB.key);

console.log(
    'Equal:',
    sessionA.key.every(
        (v, i) => v === sessionB.key[i],
    ),
);*/


import {
  AES,
  AttachmentsProtocol, DeviceKeyManager,
  fromBase64Url,
  generateHKDFSalt, IndexedDBStorage, MemoryStorage, OneTimeKeyManager,
  RegistrationProtocol,
  SessionKeyManager, Signature, toBase64Url, utf8ToBytes,
  X25519
} from "@petoman/crypto";
import {onMounted} from "vue";

onMounted(async () => {

  /*const alice =
      X25519.generateKeyPair();

  const bob =
      X25519.generateKeyPair();


  const aliceSecret =
      X25519.computeSharedSecret(
          X25519.importKey(alice.privateKey),
          X25519.importKey(bob.publicKey),
      );

  const bobSecret =
      X25519.computeSharedSecret(
          X25519.importKey(bob.privateKey),
          X25519.importKey(alice.publicKey),
      );

  const salt =
      generateHKDFSalt();

  const aliceSession =
      SessionKeyManager.deriveSessionKey(

          aliceSecret,

          'consultation-1',

          1,

          'device-a',

          salt,

      );

  const bobSession =
      SessionKeyManager.deriveSessionKey(

          bobSecret,

          'consultation-1',

          1,

          'device-a',

          salt,

      );

  console.log(
      'Session Equal:',
      aliceSession.key.every(
          (v, i) => v === bobSession.key[i],
      ),
  );

  const encrypted =
      await AES.encryptText(
          'Hello Petoman',

          aliceSession.key,

          1,
      );

  const plain =
      await AES.decryptText(
          encrypted,

          bobSession.key,
      );

  console.log(plain);*/

  /*const bundle =
      await RegistrationProtocol.create();

  const body = {
    deviceIdentifier: "DESKTOP-ALI-001",
    deviceName: "Ali Laptop",
    deviceType: "DESKTOP",

    operatingSystem: "Windows 11",
    browser: "Chrome",

    identityKey: bundle.registration.identityPublicKey,

    signedPreKey: bundle.registration.signedPreKey.publicKey,

    signedPreKeySignature:
    bundle.registration.signedPreKey.signature,

    oneTimePreKeys:
        bundle.registration.oneTimePreKeys.map(k => ({
          publicKey: k.publicKey,
        })),
  };

  console.log(JSON.stringify(body, null, 2));

  console.log(
      "test",bundle.registration.oneTimePreKeys[0]
  );

  console.log(bundle);
  console.log(bundle.registration);
  console.log(bundle.secrets);
  console.log(
      bundle.registration.oneTimePreKeys.length
  );
  console.log(
      bundle.registration.signedPreKey
  );

  const valid =
      await RegistrationProtocol.verify(
          bundle.registration.signedPreKey,
          bundle.registration.signingPublicKey,
      );

  console.log(valid);*/

  /*const bundle =
      await RegistrationProtocol.create();

  const challenge =
      "35RTXfozQw1ZqvDtqhYuvVAocNwonH4oK4SlXvSX_w4";

  const signature =
      await Signature.sign(

          utf8ToBytes(challenge),

          Signature.importKey(
              bundle.secrets.signingPrivateKey,
          ),

      );

  console.log(
      Signature.exportKey(signature),
  );*/

  const challenge="ttDdM70qSFmJsYkBPtQ7sKelbv1vxAyMRLWskcTWoyY"

  const bundle =
      await RegistrationProtocol.create();

  const signature =
      await Signature.sign(

          new TextEncoder().encode(challenge),

          fromBase64Url(
              bundle.secrets.signingPrivateKey,
          ),

      );

  console.log('ggg',
      toBase64Url(signature),
  );
  console.log('bundle.registration.signingPublicKey',bundle.registration.signingPublicKey)
  console.log('bundle.registration.identityPublicKey',bundle.registration.identityPublicKey)
  console.log('bundle.registration.signedPreKey.publicKey',bundle.registration.signedPreKey.publicKey)
  console.log('bundle.registration.signedPreKey.signature',bundle.registration.signedPreKey.signature)

  /////////

  /*const alice =
      X25519.generateKeyPair();

  const bob =
      X25519.generateKeyPair();

  const sharedSecret =
      X25519.computeSharedSecret(

          X25519.importKey(
              alice.privateKey,
          ),

          X25519.importKey(
              bob.publicKey,
          ),

      );

  const file =
      new TextEncoder().encode(
          'Petoman Attachment Test',
      );

  const encrypted =
      await AttachmentsProtocol.encrypt(

          'consultation-1',

          1,

          'device-alice',

          sharedSecret,

          file,

          'hello.txt',

          'text/plain',

      );

  console.log(encrypted);

  const derived =
      SessionKeyManager.deriveAttachmentKey(

          sharedSecret,

          'consultation-1',

          1,

          fromBase64Url(
              encrypted.hkdfSalt,
          ),

      );


  const decrypted =
      await AttachmentsProtocol.decrypt(

          encrypted.payload,

          derived.key,

      );

  console.log(
      new TextDecoder().decode(
          decrypted,
      ),
  );*/

  /////////
  /*const storage = new IndexedDBStorage();

  await storage.open();

  console.log("IndexedDB opened");

  const identity =
      DeviceKeyManager.generateIdentityKey();

  await storage.saveIdentityKey(identity);

  const loaded =
      await storage.getIdentityKey();

  console.log(identity);
  console.log(loaded);
  console.log(
      JSON.stringify(identity) ===
      JSON.stringify(loaded),
  );

  const signing =
      await DeviceKeyManager.generateSigningKey();

  await storage.saveSigningKey(signing);

  const loadedSigning =
      await storage.getSigningKey();

  console.log(
      JSON.stringify(signing) ===
      JSON.stringify(loadedSigning),
  );

  const signed =
      await DeviceKeyManager.generateSignedPreKey(
          "device-1",
          signing.privateKey,
      );

  await storage.saveSignedPreKey(
      signed.publicKey,
  );

  const loadedSigned =
      await storage.getSignedPreKey();

  console.log(
      loadedSigned,
  );

  console.log(
      loadedSigned?.id ===
      signed.publicKey.id,
  );

  const bundle =
      OneTimeKeyManager.generate();

  await storage.saveOneTimeKeys(
      bundle.publicKeys,
  );

  const loadedKeys =
      await storage.getOneTimeKeys();

  console.log(
      loadedKeys.length,
  );

  console.log(
      loadedKeys.length ===
      bundle.publicKeys.length,
  );

  await storage.saveSessionKey({

    consultationId: "consultation-1",

    deviceId: "device-1",

    version: 1,

    encryptedKey: "AAA",

    hkdfSalt: "BBB",

    createdAt: new Date().toISOString(),

  });

  const session =
      await storage.getSessionKey(

          "consultation-1",

          "device-1",

      );

  console.log(session);

  const all =
      await storage.getAllSessionKeys();

  console.log(all.length);

  await storage.deleteSessionKey(

      "consultation-1",

      "device-1",

  );

  const deleted =
      await storage.getSessionKey(

          "consultation-1",

          "device-1",

      );

  console.log(deleted);

  await storage.deleteAllSessionKeys();

  console.log(
      await storage.getAllSessionKeys(),
  );

  await storage.close();

  await storage.destroy();

  console.log("Database destroyed");*/

  ///////////////

  /*const storage = new MemoryStorage();

  console.log("MemoryStorage Ready");

  const identity =
      DeviceKeyManager.generateIdentityKey();

  await storage.saveIdentityKey(identity);

  const loaded =
      await storage.getIdentityKey();

  console.log(
      JSON.stringify(identity) ===
      JSON.stringify(loaded),
  );

  const signing =
      await DeviceKeyManager.generateSigningKey();

  await storage.saveSigningKey(signing);

  const loadedSigning =
      await storage.getSigningKey();

  console.log(
      JSON.stringify(signing) ===
      JSON.stringify(loadedSigning),
  );

  const signed =
      await DeviceKeyManager.generateSignedPreKey(
          "device-memory",
          signing.privateKey,
      );

  await storage.saveSignedPreKey(
      signed.publicKey,
  );

  const loadedSigned =
      await storage.getSignedPreKey();

  console.log(
      loadedSigned?.id ===
      signed.publicKey.id,
  );

  const bundle =
      OneTimeKeyManager.generate();

  await storage.saveOneTimeKeys(
      bundle.publicKeys,
  );

  const loadedKeys =
      await storage.getOneTimeKeys();

  console.log(
      loadedKeys.length,
  );

  console.log(
      loadedKeys.length ===
      bundle.publicKeys.length,
  );

  await storage.saveSessionKey({

    consultationId: "consultation-memory",

    deviceId: "device-memory",

    version: 1,

    encryptedKey: "AAA",

    hkdfSalt: "BBB",

    createdAt: new Date().toISOString(),

  });

  const session =
      await storage.getSessionKey(

          "consultation-memory",

          "device-memory",

      );

  console.log(session);

  const all =
      await storage.getAllSessionKeys();

  console.log(all.length);

  await storage.deleteSessionKey(

      "consultation-memory",

      "device-memory",

  );

  const deleted =
      await storage.getSessionKey(

          "consultation-memory",

          "device-memory",

      );

  console.log(deleted);

  await storage.saveSessionKey({

    consultationId: "1",

    deviceId: "1",

    version: 1,

    encryptedKey: "A",

    hkdfSalt: "B",

    createdAt: new Date().toISOString(),

  });

  await storage.saveSessionKey({

    consultationId: "2",

    deviceId: "2",

    version: 1,

    encryptedKey: "A",

    hkdfSalt: "B",

    createdAt: new Date().toISOString(),

  });

  await storage.deleteAllSessionKeys();

  console.log(
      await storage.getAllSessionKeys(),
  );

  await storage.destroy();

  console.log(
      await storage.getIdentityKey(),
  );

  console.log(
      await storage.getSigningKey(),
  );

  console.log(
      await storage.getOneTimeKeys(),
  );*/
})

</script>