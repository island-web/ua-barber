

function between (from, to, val = "null")   {

    if(val === "null") { val = moment(new Date(), 'HH:mm:ss') }
    else { val = moment(val, 'HH:mm:ss') }

    console.log(val);
    console.log(moment(from, "HH:mm:ss"));

    if (val >= moment(from, "HH:mm:ss") && val < moment(to, "HH:mm:ss")) {
        return true;
    }else{
        return false;
    }
}

function add_seconds (seconds, time = "null")   {

    let tm;
    if(time === "null") { tm = moment(new Date(), 'HH:mm:ss') }
    else { tm = moment(time, "HH:mm:ss") }

    const new_tm = tm.add(seconds, 's');

    return moment(new_tm, "HH:mm:ss");
}

function current_time (my_format = "HH:mm:ss")   { return moment(new Date(), my_format) }

function current_day () { return moment(new Date()).format('DD') }