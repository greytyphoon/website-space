var Greytyphoon = { Characters: [] };

/* FCT add stuff to tables */
function addName(questChars, table) {
    let percentWidth = Math.round(10000 / (questChars.length)) / 100; // Precise to 2nd decimal
    let row = document.createElement("tr");
    for (let character of questChars) {
        let col = document.createElement("th");
        col.innerHTML = character.name;
        col.style = "width: " + percentWidth + "%;"
        row.appendChild(col);
    }
    let head = document.createElement("thead");
    head.appendChild(row);
    table.appendChild(head);
}
function addLine(questChars, table, fct) {
    let row = document.createElement("tr");
    for (let character of questChars) {
        let col = document.createElement("td");
        fct(character).forEach(node => col.appendChild(node));
        row.appendChild(col);
    }
    table.appendChild(row);
}
function link(obj) {
    let lnk = document.createElement("a");
    lnk.href = obj["link"];
    lnk.appendChild(document.createTextNode(obj.name));
    return lnk;
}
function addSum(questChars, table) {
    let row = document.createElement("tr");
    for (let character of questChars) {
        let sum = 0;
        for (let item of character.loot) {
            sum += item.value;
        }
    
        let col = document.createElement("th");
        col.innerHTML = sum;
        row.appendChild(col);
    }
    let foot = document.createElement("tfoot");
    foot.appendChild(row);
    table.appendChild(foot);
}

/* FCT CHAR INFO --- they take a character, and return an array of html nodes. */
function addAlignment(character) {
    return [document.createTextNode(character.alignment)];
}
function addDeity(character) {
    console.log(character.deity);
    if (!character.deity["link"])
        return [document.createTextNode(character.deity)];

    /* Uncommon/custom gods can be links */
    return [link(character.deity)];
}
function addLanguages(character) {
    return [document.createTextNode(character.languages)];
}
function addCompanion(character) {
    if (!character.meta.companion)
        return [];

    return [link(character.meta.companion)];
}
function addSource(character) {
    if (!character.meta.source)
        return [];

    return [link(character.meta.source)];
}
function addAncestry(character) {
    let lnk = link(character.ancestry);

    if (!character.ancestry.archetypes)
        return [lnk];

    lnk.className = 'listBonusBreaker';
    let archetypeDesc = document.createElement("span");
    archetypeDesc.className = 'listBonuses';
    archetypeDesc.appendChild(document.createTextNode(character.ancestry.archetypes.map(x => x.name).join(", ")));
    return [lnk, archetypeDesc];
}
function addClasses(character) {
    if (character.level.length == 1)
        return addClass(character.level[0]);

    let divArray = [];
    for (let lvl of character.level)
    {
        let currDiv = document.createElement("div");
        addClass(lvl).forEach(node => currDiv.appendChild(node));
        divArray.push(currDiv);
    }
    return divArray;
}
function addClass(level)
{
    if (!level.archetypes || level.archetypes.length == 0)
        return [link(level), document.createTextNode(" " + level.quantity)];

    let classSpan = document.createElement("span");
    classSpan.className = "listBonusBreaker";
    classSpan.appendChild(link(level));
    classSpan.appendChild(document.createTextNode(" " + level.quantity));

    let spanArray = [classSpan];
    for (let archetype of level.archetypes)
    {
        let currSpan = document.createElement("span");
        currSpan.className = "listBonuses"
        currSpan.appendChild(link(archetype));

        if (archetype.title && archetype.title != "")
            currSpan.appendChild(document.createTextNode(" " + archetype.title));

        spanArray.push(currSpan);
    }
    return spanArray;
}
function addStat(characterStat) {
    if (typeof characterStat === 'number')
    {
        return [document.createTextNode(characterStat)];
    }
    
    // We want to get: "22 (17, 2, 1, 2)"
    let spanBonuses = document.createElement("span");
    spanBonuses.className = "listBonuses";
    let sum  = characterStat[0];
    let desc = characterStat[0];
    let mods = characterStat.slice(1, characterStat.length);
    for (let mod of mods)
    {
        sum += mod.points;
        desc += ", <span title='" + mod.reason + "'>" + mod.points + "</span>";
    }
    spanBonuses.innerHTML = desc;
    return [document.createTextNode(sum + " "), spanBonuses];
}
function addStr(character) {
    return addStat(character.str);
}
function addDex(character) {
    return addStat(character.dex);
}
function addCon(character) {
    return addStat(character.con);
}
function addInt(character) {
    return addStat(character.int);
}
function addWis(character) {
    return addStat(character.wis);
}
function addCha(character) {
    return addStat(character.cha);
}
function addFeats(featArray)
{
    if (!featArray || !featArray.length || featArray.length <= 0)
        return [];

    let returnValue = [link(featArray[0])];
    let moreFeats = featArray.slice(1, featArray.length);
    for (let feat of moreFeats) {
        returnValue.push(document.createElement("br"));
        if (feat.drawback)
            returnValue.push(document.createTextNode("Drawback: "));
        if (feat.title)
            returnValue.push(document.createTextNode(feat.title + ": "));
        if (feat["link"])
            returnValue.push(link(feat));
        else
            returnValue.push(document.createTextNode(feat.name));
    }
    return returnValue;
}
function addTraits(character) {
    return addFeats(character.traits);
}
function addStartingFeats(character) {
    return addFeats(character.startingFeats);
}
function addProgressFeats(character) {
    return addFeats(character.progressFeats);
}
function addTargetFeats(character) {
    return addFeats(character.targetFeats);
}
function addSpells(character)
{
    if (!character.spells || !character.spells.length || character.spells.length <= 0)
        return [];
    
    let returnValue = [];
    let spellOne = link(character.spells[0]);
    spellOne.className = character.spells[0].tag ? "spell " + character.spells[0].tag : "spell";
    let moreSpells = character.spells.slice(1, character.spells.length);
    for (let spell of moreSpells) {
        returnValue.push(document.createElement("br"));
        let aSpell = link(spell);
        aSpell.className = spell.tag ? "spell " + spell.tag : "spell";
        returnValue.push(aSpell);
    }
    return returnValue;
}

/* Main */
function main(questName) {
	let questChars = Greytyphoon.Characters.filter(character => character.meta
															 && !character.meta.dead
															 && !character.meta.npc
															 && character.meta.quest == questName);
	var charInfoTable = document.getElementById("charInfo");
	var lootTable = document.getElementById("loot");
	var spellTable = document.getElementById("spells");
	var buildTable = document.getElementById("build");

	addName(questChars, charInfoTable);
	addLine(questChars, charInfoTable, addAlignment);
	addLine(questChars, charInfoTable, addDeity);
	addLine(questChars, charInfoTable, addLanguages);
	addLine(questChars, charInfoTable, addAncestry);
	addLine(questChars, charInfoTable, addClasses);
	addLine(questChars, charInfoTable, addStr);
	addLine(questChars, charInfoTable, addDex);
	addLine(questChars, charInfoTable, addCon);
	addLine(questChars, charInfoTable, addInt);
	addLine(questChars, charInfoTable, addWis);
	addLine(questChars, charInfoTable, addCha);
	if (questChars.some(character => character.meta.companion))
		addLine(questChars, charInfoTable, addCompanion);
	if (questChars.some(character => character.meta.source))
		addLine(questChars, charInfoTable, addSource);

	addName(questChars, lootTable);
	addSum(questChars, lootTable);
    
    addName(questChars, spellTable);
    addLine(questChars, spellTable, addSpells);
    
    addName(questChars, buildTable);
    addLine(questChars, buildTable, addTraits);
    addLine(questChars, buildTable, addStartingFeats);
    addLine(questChars, buildTable, addProgressFeats);
    // addLine(questChars, buildTable, addTargetFeats);
}