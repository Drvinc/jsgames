document.getElementById("duration").addEventListener("input", () => {
  document.getElementById("durationValue").textContent = document.getElementById("duration").value;
});

async function resolvePMIDs() {
  const pmidsTextArea = document.getElementById("pmids");
  const ids = pmidsTextArea.value.trim().split("\n");
  const resultsTable = document.getElementById("results");
  const durationInput = document.getElementById("duration");

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i].trim();

    // Check if input is a DOI
    let pmid = id;
    if (id.toLowerCase().startsWith('10.')) {
      const doiUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${id}[doi]&retmode=json`;
      const doiResponse = await fetch(doiUrl);
      const doiData = await doiResponse.json();
      if (doiData.esearchresult.idlist.length > 0) {
        pmid = doiData.esearchresult.idlist[0];
      } else {
        console.error('DOI not found in PubMed:', id);
        continue;
      }
    }

    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmid}&retmode=json`;
    const response = await fetch(url);
    const data = await response.json();
    const result = data.result[pmid];
    const duration = parseInt(durationInput.value);

    // Extract information and generate citation
    const title = result.title;
    const journal = result.source;
    const year = result.pubdate.substring(0, 4);
    let doi = "";
    const doiObj = result.articleids.find(item => item.idtype === "doi");
    if (doiObj != null) {
      doi = doiObj.value;
    }
    const pmidText = "pmid:" + pmid;
    const doiText = "doi:" + doi;
    const authors = result.authors;
    let authorList = "";
    const numAuthors = authors.length;
    for (let j = 0; j < numAuthors; j++) {
      const Name = authors[j].name;
      if (j == 0) {
        authorList += Name;
      } else if (j < 3) {
        authorList += ", " + Name;
      } else if (j == 3) {
        authorList += ", et al. ";
      }
    }
    if (numAuthors <= 3) {
      authorList = authorList + ". ";
    }
    const authorFirst = result.sortfirstauthor;
    const volume = result.volume;
    const issue = result.issue;
    const pages = result.pages;
    const citationText = authorList + title + " " + journal + ". " + year + ";" + volume + (issue ? "(" + issue + ")" : "") + ":" + pages + ". " + "doi:" + doi;
    const pmidLink = `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
    const doiLink = `https://doi.org/${doi}`;
    const citationShortText = (numAuthors > 1 ? authorFirst + ", et al" : authorFirst) + ". " + journal + ". " + year + ";" + volume + (issue ? "(" + issue + ")" : "") + ":" + pages + ". " + "doi:" + doi;

    // Add the result to the table
    const newRow = resultsTable.insertRow(-1);
    newRow.insertCell(0).textContent = year;
    newRow.insertCell(1).innerHTML = `<i>${journal}</i>`; 
    newRow.insertCell(2).textContent = authorList;
    newRow.insertCell(3).textContent = title;
    newRow.insertCell(4).innerHTML = `<a href="${pmidLink}" target="_blank">${pmid}</a>`;
    newRow.insertCell(5).innerHTML = `<a href="${doiLink}" target="_blank">${doi}</a>`;
    newRow.insertCell(6).innerHTML = citationText.replace(journal, `<em>${journal}</em>`).replace(doiText, `<a href="${doiLink}" target="_blank">${doiText}</a>`); // Make journal name italic and DOI a link
    newRow.insertCell(7).innerHTML = citationShortText.replace(journal, `<em>${journal}</em>`).replace(doiText, `<a href="${doiLink}" target="_blank">${doiText}</a>`); // Make journal name italic and DOI a link

    await new Promise(r => setTimeout(r, duration));
  }
}
function clearResults() {
  const resultsTable = document.getElementById("results");
  const rowCount = resultsTable.rows.length;

  for (let i = rowCount - 1; i > 0; i--) {
    resultsTable.deleteRow(i);
  }
}