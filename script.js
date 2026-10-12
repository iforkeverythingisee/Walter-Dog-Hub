async function openNoahTutoring() {
  const fileUrl = "https://raw.githubusercontent.com/iforkeverythingisee/Walter-Dog-Hub/main/Reference/noah%27s-tutoring.html";

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("HTTP error " + response.status);

    const htmlText = await response.text();
    const newWin = window.open("", "_blank");

    if (newWin) {
      newWin.document.open();
      newWin.document.write(htmlText);
      newWin.document.close();
    } else {
      alert("Pop-up blocked! Please allow pop-ups for this site.");
    }
  } catch (err) {
    console.error("Fetch failed:", err);
    window.open("https://htmlpreview.github.io/?https://github.com/iforkeverythingisee/Walter-Dog-Hub/blob/main/Reference/noah's-tutoring.html", "_blank");
  }
}
