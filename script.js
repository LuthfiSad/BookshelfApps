const darkModeToggle = document.getElementById("dark-toggle");
const body = document.body;

function handleDarkMode() {
  if (darkModeToggle.checked) {
    document.body.id = "dark";
    localStorage.theme = "dark";
  } else {
    document.body.id = "";
    localStorage.theme = "light";
  }
}
darkModeToggle.addEventListener("change", () => {
  handleDarkMode();
});
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  darkModeToggle.checked = true;
} else {
  darkModeToggle.checked = false;
}
handleDarkMode();

const btnSearch = document.querySelector(".search .btn_search");
btnSearch.addEventListener("click", async () => {
  document.querySelector(".search").classList.toggle("active");
});

var inputTahun = document.getElementById("inputBookYear");
var tahunSaatIni = new Date().getFullYear();
inputTahun.max = tahunSaatIni;

const title = document.querySelector("#inputBookTitle");
const author = document.querySelector("#inputBookAuthor");
const year = document.querySelector("#inputBookYear");
const isNotComplete = document.querySelector("#isNotComplete");
const isComplete = document.querySelector("#isComplete");
const btnSubmit = document.querySelector("#bookSubmit");
const btnCancelEdit = document.querySelector("#cancelEdit");
const search = document.getElementById("search");
const formInput = document.getElementById("inputBook");

document.addEventListener("DOMContentLoaded", function () {
  const booksData = getBook();
  showData(booksData);
});

search.addEventListener("input", (e) => {
  const booksData = getBook();
  showData(booksData);
});

function getBook() {
  return JSON.parse(localStorage.getItem("BookshelfApps")) || [];
}

function showData(books) {
  let results = [];
  if (search.value == "") {
    results = books;
  } else {
    books.map((book) => {
      if (
        book.title.toLowerCase().includes(search.value.toLowerCase()) ||
        book.author.toLowerCase().includes(search.value.toLowerCase()) ||
        book.year.toLowerCase().includes(search.value.toLowerCase())
      ) {
        results.push(book);
      }
    });
  }
  const inCompleted = document.querySelector("#incompleteBookshelfList");
  const completed = document.querySelector("#completeBookshelfList");
  inCompleted.innerHTML = "";
  completed.innerHTML = "";
  const inCompletedList = results.some((element) => element.isCompleted == false);
  if (!inCompletedList) {
    inCompleted.innerHTML = `<div class="none_book"><small>Belum Ada Buku</small></div>`;
  }
  const CompletedList = results.some((element) => element.isCompleted == true);
  if (!CompletedList) {
    completed.innerHTML = `<div class="none_book"><small>Belum Ada Buku</small></div>`;
  }
  results.forEach((book) => {
    if (book.isCompleted == false) {
      let el = `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button class="success" onclick="readedBook('${book.id}')">Selesai dibaca</button>
                    <button class="warning" onclick="editBook('${book.id}')">Edit Buku</button>
                    <button class="danger" onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `;

      inCompleted.innerHTML += el;
    } else {
      let el = `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button class="success" onclick="unreadedBook('${book.id}')">Belum selesai di Baca</button>
                    <button class="warning" onclick="editBook('${book.id}')">Edit Buku</button>
                    <button class="danger" onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `;
      completed.innerHTML += el;
    }
  });
}

formInput.addEventListener("submit", function (e) {
  e.preventDefault();
  const sameTitle = getBook().find((book) => book.title == title.value);
  if (sameTitle && btnSubmit.value != sameTitle.id) {
    alert("Title TIdak Boleh Sama");
    return 0;
  }
  const IsComplete =
    document.querySelector('input[name="inputBookIsComplete"]:checked').value ==
    "true";
  if (btnSubmit.value == "") {
    const newBook = {
      id: +new Date(),
      title: title.value.trim(),
      author: author.value.trim(),
      year: year.value,
      isCompleted: IsComplete,
    };
    insertBook(newBook);
    alert("Buku berhasil ditambah");

    title.value = "";
    author.value = "";
    year.value = "";
    isNotComplete.checked = true;
  } else {
    const bookData = getBook().filter((book) => book.id != btnSubmit.value);
    localStorage.setItem("BookshelfApps", JSON.stringify(bookData));

    const newBook = {
      id: btnSubmit.value,
      title: title.value.trim(),
      author: author.value.trim(),
      year: year.value,
      isCompleted: IsComplete,
    };
    insertBook(newBook);
    alert("Buku berhasil diedit");
  }
});

function insertBook(book) {
  let bookData = [];

  if (localStorage.getItem("BookshelfApps") === null) {
    localStorage.setItem("BookshelfApps", 0);
  } else {
    bookData = JSON.parse(localStorage.getItem("BookshelfApps"));
  }

  bookData.unshift(book);
  localStorage.setItem("BookshelfApps", JSON.stringify(bookData));
  btnCancelEdit.click();
  showData(getBook());
}

function editBook(id) {
  const bookDataDetail = getBook().filter((book) => book.id == id);
  title.value = bookDataDetail[0].title;
  author.value = bookDataDetail[0].author;
  year.value = bookDataDetail[0].year;
  bookDataDetail[0].isCompleted
    ? (isComplete.checked = true)
    : (isNotComplete.checked = true);

  btnSubmit.innerHTML = "Edit buku";
  btnSubmit.value = bookDataDetail[0].id;
  btnCancelEdit.style.display = "block";
}

function deleteBook(id) {
  const confirmation = confirm("Yakin akan menghapusnya?");

  if (confirmation == true) {
    const bookDataDetail = getBook().filter((book) => book.id == id);
    const bookData = getBook().filter((book) => book.id != id);
    localStorage.setItem("BookshelfApps", JSON.stringify(bookData));
    showData(getBook());
    alert(`Buku ${bookDataDetail[0].title} telah terhapus`);
    btnCancelEdit.click();
  } else {
    return 0;
  }
}

function readedBook(id) {
  const confirmation = confirm("Pindahkan ke selesai dibaca?");

  if (confirmation == true) {
    const bookDataDetail = getBook().filter((book) => book.id == id);
    const bookData = getBook().filter((book) => book.id != id);
    localStorage.setItem("BookshelfApps", JSON.stringify(bookData));
    const newBook = {
      id: bookDataDetail[0].id,
      title: bookDataDetail[0].title,
      author: bookDataDetail[0].author,
      year: bookDataDetail[0].year,
      isCompleted: true,
    };

    insertBook(newBook);
  } else {
    return 0;
  }
}

function unreadedBook(id) {
  const confirmation = confirm("Pindahkan ke belum selesai dibaca?");
  if (confirmation == true) {
    const bookDataDetail = getBook().filter((book) => book.id == id);
    const bookData = getBook().filter((book) => book.id != id);
    localStorage.setItem("BookshelfApps", JSON.stringify(bookData));

    const newBook = {
      id: bookDataDetail[0].id,
      title: bookDataDetail[0].title,
      author: bookDataDetail[0].author,
      year: bookDataDetail[0].year,
      isCompleted: false,
    };

    insertBook(newBook);
  } else {
    return 0;
  }
}

btnCancelEdit.addEventListener("click", function () {
  btnSubmit.innerHTML = "Masukkan Buku";
  btnSubmit.value = "";
  title.value = "";
  author.value = "";
  year.value = "";
  isNotComplete.checked = true;
  btnCancelEdit.style.display = "none";
});
