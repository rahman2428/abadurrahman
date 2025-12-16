menuBtn?.addEventListener("click", () => {
  const nav = document.querySelector(".nav");
  nav.style.display = nav.style.display === "flex" ? "" : "flex";
  nav.style.flexDirection = "column";
});
