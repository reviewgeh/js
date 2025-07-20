// Mengambil elemen dari halaman AMP
const form = document.getElementById('commentForm');
const nameInput = document.getElementById('commentName');
const commentInput = document.getElementById('commentText');
const postIdInput = document.getElementById('postId');
const statusText = document.getElementById('commentStatus');

// GANTI DENGAN URL DATABASE FIREBASE ANDA DARI LANGKAH 1
const FIREBASE_URL = "https://reviewgeh-komentar-default-rtdb.asia-southeast1.firebasedatabase.app/";

// Menjalankan kode saat form di-submit
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Mencegah reload halaman

  const postId = postIdInput.value;
  const name = nameInput.value.trim();
  const comment = commentInput.value.trim();

  // Validasi sederhana sebelum mengirim
  if (name.length < 2 || comment.length < 5) {
    statusText.textContent = 'Nama atau komentar terlalu pendek!';
    return;
  }

  statusText.textContent = 'Mengirim...';

  const newCommentData = {
    nama: name,
    komentar: comment,
    // Firebase akan mengurutkan berdasarkan ID unik yang dibuat, jadi timestamp tidak wajib
  };

  // Mengirim data ke Firebase
  fetch(`${FIREBASE_URL}/comments/${postId}.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCommentData),
  })
  .then(response => response.json())
  .then(data => {
    statusText.textContent = 'Berhasil dikirim!';
    form.reset();

    // Update UI secara instan
    AMP.getState('commentsState.comments').then(currentComments => {
      const updatedComments = [newCommentData, ...(currentComments || [])];
      AMP.setState({ commentsState: { comments: updatedComments } });
    });
  })
  .catch(error => {
    console.error('Error:', error);
    statusText.textContent = 'Gagal mengirim komentar.';
  });
});