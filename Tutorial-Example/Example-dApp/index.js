
// const aionweb3 = require("aion-web3");
let web3 = new Web3(new Web3.providers.HttpProvider("https://api.nodesmith.io/v1/aion/avmtestnet/jsonrpc?apiKey=1985309ba6ee4fb29d89370104fee4fb"));
let contractAddress = "0x0fb89139c5ac350930d6716bde7ab18d8c0abbf12a8f3a9c2e27d9afe675fb22";
// let contractAddress= "0x0fd562355cb8052471d32f2b1d707d05cb8684533299fe467ecf8a9affb16c5f";
let accountAddress = "0xa029475725af9615a4599903e8191eb360a112150cf1f41c04cab8021cf66141";
//
let accountPK = "65c0efed4f5b4ddde333b897af06783707de119e1d64e467a396b646db131e3f86dc64c7d660687976f56798d62d28255bdf52f424ffda08cb07efbfcbb4d1c5"

function sendTransaction(method, argType, arg) {

  var stringToGreet = document.getElementById("stringToGreet").value;

    // 1. Contract method definition
    console.log(web3);
    let method = web3.avm.method(method).argTypes(argType);
    let data = method.encodeToHex(arg);

    // 2. Create the transaction object
    let txObject = {
        from: accountAddress, // your account address
        to: contractAddress,
        gas: 2000000,
        data: data,
        type: '0xf'
    };

    // 3. Sign Transaction
    let signTxObject;

    web3.eth.accounts.signTransaction( // Signing function
        txObject, accountPK
    ).then(function(res) {
        signedTxObject = res;

        // 4. Send Signed Transaction
        web3.eth.sendSignedTransaction(
          signedTxObject.rawTransaction
        ).on('transactionHash', txHash => {
          console.log("txHash", txHash) // Print txHash
          getValueOnComplete()
        }).on('receipt',
          receipt => { console.log("tx receipt", receipt) } // Print txReceipt
        );
    });
    function getValueOnComplete() {
        var result = web3.eth.call({
            to: contractAddress, // contract address
            data: data
        });

        result.then(function(value){
          value = web3.avm.decodeOneObjectFromHex(value);

          console.log(value);
        })
    }

}

function greet ()  {
  var greetString = document.getElementById("stringToGreet").value;
  sendTransaction("greet", "String", greetString) 
}

function setString() {
  var setString = document.getElementById("stringToSet").value;
  sendTransaction("setString", "String", setString) 

}

function getString() {
  sendTransaction("getString", null , null) 
}