use wasm_bindgen::prelude::*;
use wasm_bindgen::prelude::*;
use ring::pbkdf2;
use std::num::NonZeroU32;
#[wasm_bindgen]
pub fn derive_key(password: &str, salt: &str) -> String {
    // 1. Setup the "cost" (iterations)
    let iterations = NonZeroU32::new(600_000).unwrap();

    // 2. Prepare the container for our new strong key (32 bytes)
    let mut key = [0u8; 32];

    // 3. The Grinding Process
    pbkdf2::derive(
        pbkdf2::PBKDF2_HMAC_SHA256, // The hashing algorithm
        iterations,                 // The cost (600,000)
        salt.as_bytes(),            // The salt
        password.as_bytes(),        // The weak password
        &mut key                    // Where to put the result
    );

    // 4. Convert the raw bytes to a Hex string so we can read it easily in JS
    key.iter().map(|b| format!("{:02x}", b)).collect()
}
use chacha20poly1305::{ChaCha20Poly1305, Key, Nonce}; // The Cipher
use chacha20poly1305::aead::{Aead, KeyInit}; // The Traits

#[wasm_bindgen]
pub fn encrypt(hex_key: &str, secret_data: &str) -> String {
    // 1. Convert the Hex Key back into bytes
    let key_bytes = hex::decode(hex_key).expect("Invalid Hex Key");
    let key = Key::from_slice(&key_bytes);

    // 2. Generate a random 12-byte Nonce
    let mut nonce_bytes = [0u8; 12];
    getrandom::getrandom(&mut nonce_bytes).unwrap();
    let nonce = Nonce::from_slice(&nonce_bytes);

    // 3. Encrypt the data
    let cipher = ChaCha20Poly1305::new(key);
    let ciphertext = cipher.encrypt(nonce, secret_data.as_bytes())
        .expect("Encryption Failed");

    // 4. Stitch them together: [Nonce (12B)] + [Ciphertext]
    // We need the nonce to unlock it later!
    let mut combined = nonce_bytes.to_vec();
    combined.extend_from_slice(&ciphertext);

    // 5. Return as a Hex string
    hex::encode(combined)
}

// ... existing imports ...

#[wasm_bindgen]
pub fn decrypt(hex_key: &str, encrypted_blob_hex: &str) -> String {
    // 1. Decode the Hex inputs
    let key_bytes = hex::decode(hex_key).unwrap_or_default();
    let blob_bytes = hex::decode(encrypted_blob_hex).unwrap_or_default();

    // Safety Check: Is the blob long enough to contain a nonce?
    if blob_bytes.len() < 12 {
        return "❌ Error: Data corrupted".to_string();
    }

    // 2. Split: First 12 bytes are Nonce, rest is Ciphertext
    let nonce_slice = &blob_bytes[0..12];
    let ciphertext = &blob_bytes[12..];

    let key = Key::from_slice(&key_bytes);
    let nonce = Nonce::from_slice(nonce_slice);

    // 3. Decrypt!
    let cipher = ChaCha20Poly1305::new(key);

    match cipher.decrypt(nonce, ciphertext) {
        Ok(plaintext_bytes) => {
            // Convert bytes back to readable text
            String::from_utf8(plaintext_bytes).unwrap_or("❌ Invalid Text".to_string())
        },
        Err(_) => "🔒 Decryption Failed (Wrong Key?)".to_string()
    }
}