# Pull image json-server dari Docker Hub
docker pull clue/json-server

# Menjalankan container json-server
# Penjelasan command:
# docker run      : Perintah untuk menjalankan container
# -d             : Run container dalam mode detached (background)
# -p 80:80       : Map port 80 host ke port 80 container
# -v [src]:[dst] : Mount volume dari file lokal ke container
#                  File db.json dari komputer host di-mount ke /data/db.json di container
# clue/json-server: Nama image yang digunakan
docker run -d -p 80:80 -v C:\Users\malik\parking-map\src\db.json:/data/db.json clue/json-server