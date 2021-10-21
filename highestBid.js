var highestBid={
    bid:0,
    user:'',
};


const updateBid=({bid,user})=>{
    console.log(bid,user);
    highestBid={bid:bid,user:user};
}

const getBid=()=>{
    return highestBid.bid;
}

const getUser=()=>{
    return highestBid.user;
}

module.exports ={updateBid,getBid,getUser};