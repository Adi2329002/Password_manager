# Start with a standard Node.js image
FROM node:22-bullseye

# 👇 NEW: Install Clang and Build Tools (Required for Ring/Crypto)
RUN apt-get update && apt-get install -y clang llvm build-essential

# 1. Install Rust (so we can compile the WASM)
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# 2. Install wasm-pack
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Set up the workspace
WORKDIR /app

# 3. Copy the Rust Library
COPY my_crypto_lib ./my_crypto_lib

# 4. Build the WASM inside Docker
WORKDIR /app/my_crypto_lib
RUN wasm-pack build --target web

# 5. Copy the Frontend Code
WORKDIR /app/frontend
COPY frontend .

# 6. Install Dependencies & Link the WASM
RUN npm install ../my_crypto_lib/pkg
RUN npm install

# 7. Expose the Vite port
EXPOSE 5173

# 8. Start the Dev Server
CMD ["npm", "run", "dev", "--", "--host"]