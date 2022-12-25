//------------------------------------------------------------------------------
// file properties
//------------------------------------------------------------------------------
//  file     : smta.js
//  date     : 16-09-2017
//  version  : 2.1
//  language : Javascript, CSS
//  author   : SMTA developer
//  company  : Spectrum Monitoring Technology Advisors bv
//------------------------------------------------------------------------------


function switchTab(event, tabid)
{
  let tabcontent = document.getElementsByName(event.currentTarget.name.replace("button","content"));
  for (var i=0; i<tabcontent.length; i++) if (tabid==i) tabcontent[i].style.display = "block"; else tabcontent[i].style.display = "none";
  let tablinks = document.getElementsByClassName("smtatabbuttonactive");
  for (var i=0; i<tablinks.length; i++) { if (tablinks[i].name == event.currentTarget.name) tablinks[i].className = tablinks[i].className.replace("active", ""); }
  event.currentTarget.className += "active";
}


function switchDisplayMode(event, mode)
{
  var marketheader = document.getElementsByName("marketheader");
  var operatorlegend = document.getElementsByName("operatorlegend");
  if ((marketheader.length > 0) && (operatorlegend.length > 0))
  {
    if (marketheader[0].style.display == "none")
    {
      for (var i=0; i<marketheader.length; i++) marketheader[i].style.display = "block";
      for (var i=0; i<operatorlegend.length; i++) operatorlegend[i].style.display = "block";
    }
    else
    {
      for (var i=0; i<marketheader.length; i++) marketheader[i].style.display = "none";
      for (var i=0; i<operatorlegend.length; i++) operatorlegend[i].style.display = "none";
    }
  }
}


function showChartSettings(event, market)
{
  var countrysettingsdiv = document.getElementById(market+'countrysettings');
  var areasettingsdiv = document.getElementById(market+'areasettings');
  var viewsettingsdiv = document.getElementById(market+'viewsettings');
  var advertisement2div = document.getElementById(market+'advertisement');
  if (areasettingsdiv.style.display == 'block') displayval = 'none'; else displayval = 'block';
  countrysettingsdiv.style.display = displayval;
  areasettingsdiv.style.display = displayval;
  viewsettingsdiv.style.display = displayval;
  advertisement2div.style.display = displayval;
  return 0;
}


function showSpectrumChart(event)
{
  var location = 'frequencies.php';
  if (document.getElementById('selectbyband').style.display == 'block')
  {
    var firstbandchecked = false;
    var checkboxes = document.getElementsByName("bandselectbox");
    for (var i=0; i<checkboxes.length; i++) if (checkboxes[i].checked) { if (!firstbandchecked) { firstbandchecked=true; location +='?band=' } else { location += '+' } location += checkboxes[i].id; }
    var firstmarketchecked = false;
    var checkboxes = document.getElementsByName("marketselectbox");
    for (var i=0; i<checkboxes.length; i++) if (checkboxes[i].checked) { if (!firstmarketchecked) { firstmarketchecked=true; firstbandchecked==true?location += '&':location +='?'; location += 'market=' } else { location += '+' } location += checkboxes[i].id; }

  }
  else if (document.getElementById('selectbycarrier').style.display == 'block')
  {
    var firstcarrierchecked = false;
    var checkboxes = document.getElementsByName("carrierselectbox");
    for (var i=0; i<checkboxes.length; i++) if (checkboxes[i].checked) { if (!firstcarrierchecked) { firstcarrierchecked=true; location +='?carrier=' } else { location += '+' } location += checkboxes[i].id; }
  }
  else if (document.getElementById('selectbymarket').style.display == 'block')
  {
    var firstmarketchecked = false;
    var checkboxes = document.getElementsByName("marketselectbox");
    for (var i=0; i<checkboxes.length; i++) if (checkboxes[i].checked) { if (!firstmarketchecked) { firstmarketchecked=true; location +='?market=' } else { location += '+' } location += checkboxes[i].id; }
  }
  window.location=location;
}


function zoomSpectrumChart(value, market)
{
  var blocks = document.getElementsByName(market + 'licenceblock');
  var zoomfactor = 1;
  switch(parseInt(value)) { case -2: zoomfactor = 0.5; break; case 2: zoomfactor = 2; break; case 4: zoomfactor = 3; break; case 6: zoomfactor = 4; break; case 8: zoomfactor = 5; break; }
  for(var i=0; i<blocks.length; i++) 
  {
    var newWidth = zoomfactor * parseInt(blocks[i].getAttribute('defaultwidth'),10);
    blocks[i].style.width = newWidth.toString() + 'px';
  }
}


function populateselectcountry(selectcountryname,selectedcountrycode)
{
  var selectcountry = document.getElementById(selectcountryname);
  for(var i=0; i<C.length; i++)
  {
    selectcountry.options[selectcountry.options.length] = new Option(C[i].length>4?C[i][1]+" ->":C[i][1], C[i][0]);
    for (var j=0; j<C[i].length; j+=2) if (C[i][j] == selectedcountrycode) selectcountry.selectedIndex = i+1;
  }
}


function populateselectmarket(selectcountryname, selectmarketname, selectedmarketcode)
{
  var selectcountry = document.getElementById(selectcountryname);
  var selectmarket = document.getElementById(selectmarketname);
  if (selectedmarketcode.length == 0) selectedmarketcode = selectcountry.value; 
  selectmarket.options.length = 0;
  for (var i=0; i<C.length; i++)
  {
    if (C[i][0] == selectcountry.value)
    {
      selectmarket.options[selectmarket.options.length] = new Option("- All areas -", "ALL");
      for (var j=2; j<C[i].length; j+=2) { selectmarket.options[selectmarket.options.length] = new Option(C[i][j+1], C[i][j]); if (C[i][j]==selectedmarketcode) selectmarket.selectedIndex = selectmarket.options.length-1; }
    }
  }
}


function populateselectband(selectbandname)
{
  var selectband = document.getElementById(selectbandname);
  if (B.length > 1) selectband.options[selectband.options.length] = new Option("- All bands -", "ALL");
  for (var i=0; i<B.length; i++) selectband.options[selectband.options.length] = new Option(B[i], B[i]);
}


function populateselectgroup(selectgroupname,selectedgroup)
{
  var selectgroup = document.getElementById(selectgroupname);
  for (var i=0; i<G.length; i++)
  {
    selectgroup.options[selectgroup.options.length] = new Option(G[i], G[i]);
    if (G[i] == selectedgroup) selectgroup.selectedIndex = i+1;
  }
}


function populateselectoperator(selectoperatorname,selectedoperator)
{
  var selectoperator = document.getElementById(selectoperatorname);
  for (var i=0; i<O.length; i++) 
  {
    selectoperator.options[selectoperator.options.length] = new Option(O[i], O[i]);
    if (O[i] == selectedoperator) selectoperator.selectedIndex = i+1;
  }
}


function addgeofilter(divfiltername,selectcountryname,selectmarketname,buttonremovegeofiltername,buttonaddgeofiltername,remove)
{
  var divfilter = document.getElementById(divfiltername);
  if (remove) divfilter.style.height = parseint(divfilter.style.height) - 20 + "px"; else divfilter.style.height = parseInt(divfilter.style.height) + 20 + "px";
  var selectcountry = document.getElementById(selectcountryname);
  if (remove) selectcountry.style.display='none'; else selectcountry.style.display='inline';
  var selectmarket = document.getElementById(selectmarketname);
  if (remove) selectmarket.style.display='none'; else selectmarket.style.display='inline';
  var buttonremovegeofilter = document.getElementById(buttonremovegeofiltername);
  if (remove) buttonremovegeofilter.style.display='none'; else buttonremovegeofilter.style.display='inline';
  var buttonaddgeofilter = document.getElementById(buttonaddgeofiltername);
  if (remove) buttonaddgeofilter.style.display='none'; else buttonaddgeofilter.style.display='inline';
}


function showlicence(selectcountryname, selectmarketname, selectbandname, checkboxlegendname, rangezoomname)
{
  var location = 'licence.php?';
  if ((selectcountryname != null) && (selectmarketname != null)) 
  {
    var selectcountry = document.getElementById(selectcountryname);
    var selectmarket = document.getElementById(selectmarketname);
    if (selectmarket.value=='ALL') location+= "c=" + selectcountry.value;
                              else location+= "m=" + selectmarket.value;
  }
  if (selectbandname != null)
  {
    var selectband = document.getElementById(selectbandname);
    if (selectband.selectedIndex > 0) location+= '&b=' + selectband.value;
  }
  if (checkboxlegendname != null)
  {
    var checkboxlegend = document.getElementById(checkboxlegendname);
    if (checkboxlegend.checked) location += '&l=1';
  }
  if (rangezoomname != null)
  {
    var rangezoom = document.getElementById(rangezoomname);
    if ((rangezoom.value >= 3) && (rangezoom.value <= 7)) location += '&z=' + rangezoom.value;
  }
  window.location=location;
}


function showmarket(selectcountryname, selectmarketname)
{
  var location = 'market.php?';
  var selectcountry = document.getElementById(selectcountryname);
  var selectmarket = document.getElementById(selectmarketname);
  if (selectmarket.value=='ALL') location+= "c=" + selectcountry.value;
                            else location+= "m=" + selectmarket.value;
  window.location=location;
}


function showoperator(selectoperatorname, local)
{
  var selectoperator = document.getElementById(selectoperatorname);
  var location = 'operator.php?';
  if (local==true) location+= "o="; else location+= "g=";
  location += selectoperator.value;
  window.location=location;
}


function calculateFrequency(event)
{
  let location = 'systems.php?channel=' + Math.round(document.getElementById("calculatorselectbox").value);
  window.location=location;
}


function rotatebanner(fad1, fad2, fad3)
{
  var adimgs = ["images/adsul.jpg", "images/adbil.jpg", "images/adlll.jpg"];
  var adlinks = ["offers.php", "offers.php", "offers.php"];
  var adshow = [fad1?1:0, fad2?1:0, fad3?1:0];
  var adindex = adimgs.indexOf(document.getElementById("adimg").getAttribute("src"));
  var watchdog = 0;
  do
  {
    if (adindex < 0) adindex = 0; else adindex++;
    if (adindex >= adimgs.length) adindex = 0;
    watchdog++;
  }
  while ((!adshow[adindex]) && (watchdog < adimgs.length))
  document.getElementById("adlink").setAttribute("href", adlinks[adindex]);
  document.getElementById("adimg").setAttribute("src", adimgs[adindex]);
}


function validatedatabaseform()
{
  let result = true;
  const alertstyle = "border:2px solid #FF0000";
  const defaultstyle = document.getElementById("inputtextreference").style;
  const defaulttdstyle = document.getElementById("tdtitle").style;
  let inputfield = document.getElementsByName("ordertype");
  let len = inputfield.length;
  let chosenoptioncount = 0;
  for (i=0; i<len; i++) if (inputfield[i].checked) chosenoptioncount++;
  inputfield = document.getElementById("tdordertype");
  let noticefield = document.getElementById("tdordertypenotice");
  if ((result) && (chosenoptioncount != 1)) { inputfield.style = alertstyle; noticefield.innerHTML = "please select whether you would like to receive an invoice or a quote"; result = false; } else { inputfield.style = defaulttdstyle; noticefield.innerHTML = ""; }
  inputfield = document.getElementById("inputtextfamilyname");
  noticefield = document.getElementById("tdfamilynamenotice");
  let re = /^[a-z ,.'-]+$/i;
  if ((result) && (re.test(inputfield.value) == false)) { inputfield.style = alertstyle; noticefield.innerHTML = "please use standard characters in the family name field"; result = false; } else { inputfield.style = defaultstyle; noticefield.innerHTML = ""; }
  inputfield = document.getElementById("inputtextfirstname");
  noticefield = document.getElementById("tdfirstnamenotice");
  re = /^[a-z ,.'-]+$/i;
  if ((result) && (re.test(inputfield.value) == false)) { inputfield.style = alertstyle; noticefield.innerHTML = "please use standard characters in the first name(s) field"; result = false; } else { inputfield.style = defaultstyle; noticefield.innerHTML = ""; }
  inputfield = document.getElementById("inputtextemail");
  noticefield = document.getElementById("tdemailnotice");
  re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if ((result) && (re.test(inputfield.value) == false)) { inputfield.style = alertstyle; noticefield.innerHTML = "please provide a valid e-mail address"; result = false; } else { inputfield.style = defaultstyle; noticefield.innerHTML = ""; }
  inputfield = document.getElementById("inputtextorganisation");
  noticefield = document.getElementById("tdorganisationnotice");
  re = /^(?!\s)(?!.*\s$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9 '~?!]{2,50}$/;
  if ((result) && (re.test(inputfield.value) == false)) { inputfield.style = alertstyle; noticefield.innerHTML = "please provide a valid name of your organisation"; result = false; } else { inputfield.style = defaultstyle; noticefield.innerHTML = ""; }
  inputfield = document.getElementById("textareaaddress");
  noticefield = document.getElementById("tdaddressnotice");
  re = /^[a-zA-Z0-9\s,'\.-]{8,100}$/;
  if ((result) && (re.test(inputfield.value) == false)) { inputfield.style = alertstyle; noticefield.innerHTML = "please provide a valid address to print on your invoice or quote"; result = false; } else { inputfield.style = defaultstyle; noticefield.innerHTML = ""; }
  inputfield = document.getElementsByName("plan");
  len = inputfield.length;
  chosenoptioncount = 0;
  for (i=0; i<len; i++) if (inputfield[i].checked) chosenoptioncount++;
  inputfield = document.getElementById("tdplan");
  noticefield = document.getElementById("tdplannotice");
  if ((result) && (chosenoptioncount != 1)) { inputfield.style = alertstyle; noticefield.innerHTML = "please select your subscription plan"; result = false; } else { inputfield.style = defaulttdstyle; noticefield.innerHTML = ""; }
  inputfield = document.getElementById("inputtextreference");
  noticefield = document.getElementById("tdreferencenotice");
  re = /^.{0,50}$/;
  if ((result) && (re.test(inputfield.value) == false)) { inputfield.style = alertstyle; noticefield.innerHTML = "please provide a valid reference or PO number"; result = false; } else { inputfield.style = defaultstyle; noticefield.innerHTML = ""; }
  inputfield = document.getElementById("inputcheckboxconsent");
  len = inputfield.checked;
  inputfield = document.getElementById("tdconsent");
  noticefield = document.getElementById("tdconsentnotice");
  if ((result) && (!len)) { inputfield.style = alertstyle; noticefield.innerHTML = "please check the box for your authorisation to process your request"; result = false; } else { inputfield.style = defaulttdstyle; noticefield.innerHTML = ""; }
  noticefield = document.getElementById("tdsubmitnotice");
  if (!result) { noticefield.innerHTML = "Your form is incomplete and was not sent. Please review your above input enclosed by the red box and try again."; } else { noticefield.innerHTML = ""; }
  return result;
}


function validatetrainingform()
{
  let result = true;
  const alertstyle = "border:2px solid #FF0000";
  const defaultstyle = document.getElementById("inputtextjobtitle").style;
  const defaulttdstyle = document.getElementById("tdjobtitlenotice").style;
  let inputfield = document.getElementById("inputtextfamilyname");
  let noticefield = document.getElementById("tdfamilynamenotice");
  let re = /^[a-z ,.'-]+$/i;
  if ((result) && (re.test(inputfield.value) == false)) { inputfield.style = alertstyle; noticefield.innerHTML = "please use standard characters in the family name field"; result = false; } else { inputfield.style = defaultstyle; noticefield.innerHTML = ""; }
  inputfield = document.getElementById("inputtextfirstname");
  noticefield = document.getElementById("tdfirstnamenotice");
  re = /^[a-z ,.'-]+$/i;
  if ((result) && (re.test(inputfield.value) == false)) { inputfield.style = alertstyle; noticefield.innerHTML = "please use standard characters in the first name(s) field"; result = false; } else { inputfield.style = defaultstyle; noticefield.innerHTML = ""; }
  inputfield = document.getElementById("inputtextemail");
  noticefield = document.getElementById("tdemailnotice");
  re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if ((result) && (re.test(inputfield.value) == false)) { inputfield.style = alertstyle; noticefield.innerHTML = "please provide a valid e-mail address"; result = false; } else { inputfield.style = defaultstyle; noticefield.innerHTML = ""; }
  inputfield = document.getElementById("inputtextorganisation");
  noticefield = document.getElementById("tdorganisationnotice");
  re = /^(?!\s)(?!.*\s$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9 '~?!]{2,50}$/;
  if ((result) && (re.test(inputfield.value) == false)) { inputfield.style = alertstyle; noticefield.innerHTML = "please provide a valid name of your organisation"; result = false; } else { inputfield.style = defaultstyle; noticefield.innerHTML = ""; }
  inputfield = document.getElementById("textareaaddress");
  noticefield = document.getElementById("tdaddressnotice");
  re = /^[a-zA-Z0-9\s,'-]{8,100}$/;
  if ((result) && (re.test(inputfield.value) == false)) { inputfield.style = alertstyle; noticefield.innerHTML = "please provide a valid address to print on your invoice or quote"; result = false; } else { inputfield.style = defaultstyle; noticefield.innerHTML = ""; }
  inputfield = document.getElementsByName("approval");
  len = inputfield.length;
  chosenoptioncount = 0;
  for (i=0; i<len; i++) if (inputfield[i].checked) chosenoptioncount++;
  inputfield = document.getElementById("tdapproval");
  noticefield = document.getElementById("tdapprovalnotice");
  if ((result) && (chosenoptioncount != 1)) { inputfield.style = alertstyle; noticefield.innerHTML = "please select whether you have received approval from management"; result = false; } else { inputfield.style = defaulttdstyle; noticefield.innerHTML = ""; }
  inputfield = document.getElementsByName("budget");
  len = inputfield.length;
  chosenoptioncount = 0;
  for (i=0; i<len; i++) if (inputfield[i].checked) chosenoptioncount++;
  inputfield = document.getElementById("tdbudget");
  noticefield = document.getElementById("tdbudgetnotice");
  if ((result) && (chosenoptioncount != 1)) { inputfield.style = alertstyle; noticefield.innerHTML = "please select whether you have budget for this training"; result = false; } else { inputfield.style = defaulttdstyle; noticefield.innerHTML = ""; }
  inputfield = document.getElementsByName("visaletter");
  len = inputfield.length;
  chosenoptioncount = 0;
  for (i=0; i<len; i++) if (inputfield[i].checked) chosenoptioncount++;
  inputfield = document.getElementById("tdvisa");
  noticefield = document.getElementById("tdvisanotice");
  if ((result) && (chosenoptioncount != 1)) { inputfield.style = alertstyle; noticefield.innerHTML = "please select whether you need an invitation letter for your visa"; result = false; } else { inputfield.style = defaulttdstyle; noticefield.innerHTML = ""; }
  noticefield = document.getElementById("divsubmitnotice");
  if (!result) { noticefield.innerHTML = "Your form is incomplete and was not sent. Please review your above input enclosed by the red box and try again."; } else { noticefield.innerHTML = ""; }
  return result;
}


function resetinputborder(sender)
{
  sender.style = document.offersform.ponumber.style;
}
