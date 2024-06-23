
// ========================== VARS ===========================
var myParameters = {};
var myValues = {};
var workspace_name = local.parameters.workspaceID.get() ;
var cuecount = local.parameters.countOfCues.get()  ;
var workspaceNo = local.values.workspaceID.get() ;
var now = util.getTime();
var permFb  ;
var names = [];
var requests = [];
var requestsAdr = [];
var requestsArg = [];
var wild = "*" ;
var parse ;
var cueNo ;
var cueNamSho = 1 ;
var fbRate = 2 ;
var selCue ;

var cueColors = ["none","berry","blue","crimson","cyan","forest","gray","green","hot pink","indigo","lavender","magenta","midnight","olive","orange","peach","plum","purple","red","sky blue","yellow"] ;


//====================================================================
//		INITIAL FUNCTIONS 
//====================================================================

//  initial functions
function init() {

		
// Insert Parameter Buttons & Infos======>>>>>>>>>>>>>>>>>>>>>>>>

	permFb = local.parameters.addBoolParameter("Permanent Feedback", "Get Permanent Feedback from QLab" , false);
// =====================================================================
// 		VALUES CONTAINERS
// =====================================================================


	
// =====================================================================
// 		CREATE CONTAINERS
// =====================================================================



//		local.values.cueNames.countOfCueList.set(10) ;
//		local.values.cueNames.activeCueList.set(0) ;
//		local.values.cueNames.numberOfCues.set(20) ;
			
}

//========================================================================
//		HELPER
//========================================================================

function update(deltaTime) {
		
		var now = util.getTime();
		if(now > TSSendAlive) {
		var fbRate = local.parameters.setFeedbackRate.get() ;
			TSSendAlive = now + fbRate ; 
			keepAlive(); 
		 } }
		
function keepAlive() {
		if (permFb.get()) {
		local.send ("/cueLists") ;
		local.send ("/runningCues/shallow") ;
		local.send ("/selectedCues/shallow") ;
		local.send ("/cue/"+cueNo+"/currentFileTime") ;
		
//		local.send("/cue/selected/name") ;
//		local.send ("/alwaysReply" ,1) ;
//		local.send ("/updates" ,1) ;
		}
}

//========================================================================
//		 VALUE CHANGE EVENTS
//========================================================================

function moduleValueChanged(value) { 
	if (value.name == "syncCueNames"){
	local.send ("/cueLists") ;	
	}
	
	if (value.name == "cueNumber"){
	selCue = local.values.cueInfos.cueNumber.get() ;
	local.send ("/cue/"+selCue+"/notes") ;	
	local.send ("/cue/"+selCue+"/listName") ;
	local.send ("/cue/"+selCue+"/colorName") ;
	local.send ("/cue/"+selCue+"/duration") ;
	}
	
	if (value.name == "resetCueNames"){
	local.values.cueNames.cueListName.set("");
 	for (n=1 ; n<=cuecount ; n++)
 	{var child = "cue"+n ;
	local.values.cueNames.getChild(child).set("");}
	}
	
	if (value.name == "sync"){
	local.send ("/runningCues/shallow") ;
	local.send ("/selectedCues/shallow") ;
	local.send ("/cue/"+cueNo+"/currentFileTime") ;
	local.send ("/workspaces") ;
//	local.send ("/alwaysReply" ,1) ;
//	local.send ("/cueLists") ;
//	local.send("/cue/selected/name") ;
//	local.send("/cue/active/name") ;
//	local.send("/cue/playhead/name") ;
	}

// Reset CuelistCount	
	if (value.name == "countOfCueLists"){
	var clcount = local.values.cueNames.countOfCueLists.get();
	if (clcount == 1) {
	local.values.cueNames.activeCueList.set(0);}  }
	
// delete older Cue-Names	
	if (value.name == "activeCueList"){
	var count = local.values.cueNames.countOfCues.get();
	for (n=1 ; n<=count ; n++)
 	{var child = "cue"+n ;
	local.values.cueNames.getChild(child).set("");}  }
	
//  create Cue-Name-Lines
	if (value.name == "activeCueList" || value.name == "syncCueNames" || value.name == "countOfCues"){
	cuecount = local.values.cueNames.countOfCues.get()  ;
//	local.values.cueNames.test.set(value.val) ;
	for (var n = 1; n <= cuecount; n++) {
			local.values.cueNames.addStringParameter("Cue "+n, "", "");  } }

	
	
}	

//========================================================================
//		 PARAMETER CHANGE EVENTS
//========================================================================

function moduleParameterChanged(param) { 
	if (param.name == "sync"){
	local.send ("/workspaces") ;
	local.send ("/cueLists") ;
	}
}	

//============================================================
//		OSC EVENTS
//============================================================

function oscEvent(address, args) { 

/*
//>>>>>>>>>>> Set Workspace
	if (address == "/reply/updates" ) {	
	var parse = JSON.parse(args[0]) ;
		parse = parse.workspace_id ;
	local.values.workspaceID.set(parse);
	local.values.cueNames.list.set(workspace);
	}
*/	

// >>>>>>>>> Get and Set Workspace
	if (address == "/reply/workspaces" ) {
	var parse = JSON.parse(args[0]) ;
	var wsname = parse.data[0].displayName ;
	local.values.workspaceName.set(wsname);
	local.parameters.workspaceName.set(wsname);
	}
	
// >>>>>>>>> Selected Cue Infos
	if (local.match(address,"/reply/cue/*/notes")) {
	var parse = JSON.parse(args[0]) ;
	var notes = parse.data ;
	if (notes == "") { notes = "No Notes...!" ;}
	local.values.cueInfos.notes.set(notes);
	}
	if (local.match(address,"/reply/cue/*/listName")) {
	var parse = JSON.parse(args[0]) ;
	var name = parse.data ;
	local.values.cueInfos.cueName.set(name);
	}
	if (local.match(address,"/reply/cue/*/duration")) {
	var parse = JSON.parse(args[0]) ;
	var dur = parse.data ;
	local.values.cueInfos.cueDuration.set(dur);
	}
	if (local.match(address,"/reply/cue/*/colorName")) {
	var parse = JSON.parse(args[0]) ;
	var col = parse.data ;
	if (col == "none"){ var r = 0; var g = 0; var b = 0 ;}
	else if (col == "red"){ var r = 1; var g = 0; var b = 0 ;}
	else if (col == "orange"){ var r = 1; var g = 0.5; var b = 0 ;}
	else if (col == "green"){ var r = 0; var g = 1; var b = 0 ;}
	else if (col == "blue"){ var r = 0; var g = 0; var b = 1 ;}
	else if (col == "purple"){ var r = 1; var g = 0; var b = 1 ;}
	else if (col == "yellow"){ var r = 1; var g = 1; var b = 0 ;}
	else if (col == "skyblue"){ var r = 0.3; var g = 1; var b = 1 ;}
	local.values.cueInfos.cueColor.set(r,g,b);
	}
	
// >>>>>>>>> Get and Set selected and playing Cue
	if (local.match(address,"/reply/workspace/*/runningCues/shallow")) {
	var parse = JSON.parse(args[0]) ;
	var numbr = parse.data[1].number ;
	cueNo = numbr ;
	var name = parse.data[1].listName ;
	cueID = parse.data[1].uniqueID ;
	liname = numbr+" - "+name ;
	if (name == null) {liname= "no playing Cue !" ;}
	local.values.playingCue.set(liname);
	}
	if (local.match(address,"/reply/workspace/*/selectedCues/shallow")) {
	var parse = JSON.parse(args[0]) ;
	var numb = parse.data[0].number ;
	var name = parse.data[0].listName ;
	liname = numb+" - "+name ;
	if (name == null) {liname= "no selected Cue !" ;}
	local.values.nextCue.set(liname);
	}
	if (local.match(address,"/reply/cue/"+cueNo+"/currentFileTime")) {
	var parse = JSON.parse(args[0]) ;
	var time = parse.data ;
	local.values.playingTime.set(time); }
		
// >>>>>>> Get and Set  Cue Infos
	if (local.match(address,"/reply/workspace/*/cueLists")) {	
	var parse = JSON.parse(args[0]) ;
// set CueListNumber
	var cln = local.values.cueNames.activeCueList.get() ;
// get CueLists-Number
	var lnumb = parse.data.length ;
	local.values.cueNames.countOfCueLists.set(lnumb);
	local.parameters.countOfCueLists.set(lnumb);
//	local.values.cueListCount.set(lnumb);
// get Cues-Number
	var numb = parse.data[cln].cues.length ;
	local.values.cueNames.countOfCues.set(numb);
//	local.values.cuesCount.set(numb);
	local.parameters.countOfCues.set(numb);
//  insert CueList Name
	var listname = parse.data[cln].listName ;
	local.values.cueNames.cueListName.set(listname);
//  insert Workspace ID
	var workspace = parse.workspace_id ;
	local.values.workspaceID.set(workspace);
	local.parameters.workspaceID.set(workspace);
	
//  insert Cue Names 
	for (n=0 ; n<numb ; n++) {
	var no =n+1 ;	
		var cuename = parse.data[cln].cues[n].listName ;
		var cuenumber = parse.data[cln].cues[n].number ;
		var cuecolor = parse.data[cln].cues[n].colorName ;
		if (cuecolor == "none") { cuecolor = "" ;}
		else {cuecolor = "    "+cuecolor ;}
		cueNamSho = local.values.cueNames.cueNameShows.get() ;
		if (cueNamSho == 1){
		var fullname = cuenumber+" - "+cuename +cuecolor ;}
		else if (cueNamSho == 2) {fullname = cuename ;}
		else if (cueNamSho == 3) {fullname = cuenumber ;}
		else if (cueNamSho == 4) {fullname = cuecolor ;}
			
		local.values.cueNames.getChild("cue"+no).set(fullname);}
	}




}



//=========================================================
//		 REQUESTS
//=========================================================

function show_playing() {
	local.send("/cue/active/name") ;	
}


//=========================================================
//		 REGULAR FUCNTIONS
//=========================================================

// >>>>>>> MAIN CONTROL

function main_control(val) {
	local.send(val) ;	
}

function go() {
	local.send("/go") ;	
}

function pause() {
	local.send("/pause") ;	
}

function resume() {
	local.send("/resume") ;	
}

function back() {
	local.send("/playhead/previous") ;	
}

function next() {
	local.send("/playhead/next") ;	
}

function stop_play() {
	local.send("/panicInTime") ;	
}

function stop_all() {
	local.send("/panic") ;	
}

function stop_intime(time) {
	local.send("/panicInTime", time) ;	
}


function reset(no) {
	local.send("/reset") ;	
}

function cue_reset(no) {
	local.send("/cue/"+no+"/reset") ;	
}


function prewait_act(val) {	
	local.send("/cue/selected/preWait" , val) ;	
}

function postwait_act(val) {	
	local.send("/cue/selected/postWait" , val) ;	
}

// >>>>>>>>>>> CUE FEEDBACK

function active_cue() {
	local.send("/cue/active/name") ;	
}

function selected_cue() {
	local.send("/cue/selected/name") ;	
}

function playhead_cue() {
	local.send("/cue/playhead/name") ;	
}

// >>>>>>>>>>> CUE PLAY

function cue_set(no, val) {
	local.send("/cue/"+no+val) ;	
}

function cue_go(no) {
	local.send("/cue/"+no+"/go") ;	
}

function cue_stop(no) {
	local.send("/cue/"+no+"/stop") ;	
}

function cue_pause(no) {
	local.send("/cue/"+no+"/pause") ;	
}

function cue_resume(no) {
	local.send("/cue/"+no+"/resume") ;	
}

function cue_pause(no) {
	local.send("/cue/"+no+"/togglePause") ;	
}

function start_next(no) {
	local.send("/cue/"+no+"/startAndAutoloadNext");	
}

function setload(no) {
	local.send("/cue/"+no+"/loadAndSetPlayhead");	
}

function set_next(no) {
	local.send("/playhead/"+no);	
}

function cue_load(no) {
	local.send("/cue/"+no+"/load") ;	
}

function cue_prewait(no,val) {	
	local.send("/cue/"+no+"/preWait" , val) ;	
}

function cue_postwait(no,val) {	
	local.send("/cue/"+no+"/postWait" , val) ;	
}

function cue_timeload(no,val) {	
	local.send("/cue/"+no+"/loadAt" , val) ;	
}

function cue_preview(no) {	
	local.send("/cue/"+no+"/preview") ;	
}

// >>>>>>>>>>> CUE ACTIONS

function rename_cue(no, val) {
	local.send("/cue/"+no+"/name", val);	
}

function cue_notes(no, val) {
	local.send("/cue/"+no+"/notes", val);	
}

function cue_color(no, col) {
	local.send("/cue/"+no+"/colorName", col);	
}

function cue_continue(no, val) {
	local.send("/cue/"+no+"/continueMode", val);	
}

function cue_target(no, val) {
	local.send("/cue/"+no+"/cueTargetNumber", val);	
}

function renumber_cue(no, val) {
	local.send("/cue/"+no+"/number", val);	
}

function renumber_allcues(val1, val2) {
	local.send("/renumber", [val1, val2]) ;
}

function cue_duration(no, val) {
	local.send("/cue/"+no+"/duration", val);	
}

function cue_flagged(no, val) {
	local.send("/cue/"+no+"/flagged", val);	
}

function cue_autoload(no, val) {
	local.send("/cue/"+no+"/autoLoad", val);	
}

// >>>>>>>>>>> AUDIO VOLUME

function actVol_at(val) {
//	val=Math.round(val);
	local.send("/cue/active/level/0/0" , val) ;	
}

function actVol_nominal() {
	local.send("/cue/active/level/0/0", 0) ;	
	
}
function actVol_off() {
	local.send("/cue/active/level/0/0", -930) ;	
}

function actVol_full() {
	local.send("/cue/active/level/0/0", 12) ;	
}

//>>>>>>>>>>>> OSC Requests

function request_names() {
	local.send("/cue/*/name") ;
}

function request_selcue() {
	local.send("/cue/selected/name") ;
}

function request_cuelists() {
	local.send("/cueLists") ;
}

function request_uniqueids() {
	local.send("/cueLists/uniqueIDs") ;
}

function version() {
	local.send("/version") ;
}

function workspaces() {
	local.send("/workspaces") ;
}

function reply(val) {
	local.send("/alwaysReply" , val);	
}

function updates(val) {
	local.send("/updates", val);	
}

//>>>>>>>>>>>> Actions

function midiin_toggle() {
	local.send("/overrides/toggleMidiInput") ;
}

function midiout_toggle() {
	local.send("/overrides/toggleMidiOutput") ;
}

function midiin_enable(val) {
	local.send("/overrides/midiInputEnabled") ;
}

function midiout_enable(val) {
	local.send("/overrides/midiOutputEnabled") ;
}

function dmx_toggle() {
	local.send("/overrides/toggleDmxOutput") ;
}

function dmx_enable(val) {
	local.send("/overrides/dmxOutputEnabled") ;
}

function mscin_toggle() {
	local.send("/overrides/toggleMscInput") ;
}

function mscout_toggle() {
	local.send("/overrides/toggleMscOutput") ;
}

function mscin_enable(val) {
	local.send("/overrides/mscInputEnabled") ;
}

function mscout_enable(val) {
	local.send("/overrides/mscOutputEnabled") ;
}

function sysexin_toggle() {
	local.send("/overrides/toggleSysexInput") ;
}

function sysexout_toggle() {
	local.send("/overrides/toggleSysexOutput") ;
}

function sysexin_enable(val) {
	local.send("/overrides/sysexInputEnabled") ;
}

function sysexout_enable(val) {
	local.send("/overrides/sysexOutputEnabled") ;
}

function toggle_override() {
	local.send("/toggleOverrideWindow") ;
}

function toggle_timecode() {
	local.send("/toggleTimecodeWindow") ;
}





