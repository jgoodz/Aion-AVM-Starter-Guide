# Aion-AVM-Starter-Guide

This Tutorial shows you step by step how to create a front end Dapp that interacts with the Aion Virtual Machine (AVM)

The three parts to this tutorial are:

1. Create a basic HTML and javascript front end
2. Create and Deploy a java smart contract on the AVM testnet with the Maven Build tool
3. Connect the front end and smart contract together using web3 and the Aiwa browser extension.


# Quick Start

- Install Aiwa (warning: you ma need to delete MetaMask. This issue is being worked on)
- Clone this tutorial
 `Git Clone https://github.com/BlockDevsUnited/Aion-AVM-Starter-Guide.git`
- cd to Example-Dapp
- serve the webpage (optional)
  `python -m SimpleHTTPServer 8000`
- replace account address and account private key with your address and private key in index.js
- try the buttons!

# Step By Step Guide

## Create an HTML frontend

- Open a code editor. Atom of VsCode will work fine.
- create basic html page called index.html
- Open html and body tags
```
<html>
<body>
</body>
</html>
```
- Inside the body, Create a page with Greet, setString, and getString buttons, and a text input
``` <body>
<input type="text" id="streetToGreet"></input> <button onclick="greet()">Greet</button><br>
<input type="text" id="stringToSet"></input> <button onclick="setString()">set string</button> <br>
<button onclick="getString()">get string</button>
</body>
```
- In your terminal, cd to the directory where index.html is saved, and Serve the webpage
`python -m SimpleHTTPServer 8000`

- or if you don't have python installed, navigate to the directory and double-click index.html to open in the browser

- That's it, you're done!

## Deploy a smart contract with Maven
Aion4j Maven Plugin provides end to end development support for AVM based smart contract in java.

Here you will:
- Install Maven
- Create Maven project
- Point it to AVM testnet
- edit smart contract
- create new address, get AVM Testnet Aion
- Deploy contract
- Get Contract Address

Sources:  https://github.com/satran004/avm-archetype
          https://github.com/satran004/aion4j-maven-plugin/wiki/Aion4j-Maven-Plugin---User-Guide

---

### Pre-requisites
1. Java 10 and above
2. Maven 3.5.4 and above

<!--<a name="setup_build"></a>-->

### 1. Build Maven
```
git clone https://github.com/satran004/aion4j-maven-plugin.git
```

Install avm.jar to local .m2 repo for compilation
``` ./mvnw initialize
```

Compile the plugin
``` ./mvnw clean install -DskipITs
```
Run integration tests
``` ./mvnw integration-test
```

### 2. Create AVM java project
The fastest way to create a AVM project is using a maven archetype - [avm-archetype](https://github.com/satran004/avm-archetype).

Run the following maven command to create an AVM project.

```
$> mvn archetype:generate -DarchetypeGroupId=org.aion4j -DarchetypeArtifactId=avm-archetype -DarchetypeVersion=0.5
```
Follow the instruction to enter groupId, artifactId and package information to generate the project.

The generated project has a sample HelloAVM contract.

---

### 2. Edit pom.xml

Edit pom.xml file in the generated project and change &lt;aion4j.maven.plugin&gt; version to the latest release version. Please refer to [aion4j maven plugin](https://github.com/satran004/aion4j-maven-plugin) project page for the latest release version.

```
<properties>
  ...
   <aion4j.plugin.version>0.4.4</aion4j.plugin.version>
  ...
</properties>
```

---


**Contract Main-class**:

Verify contract's main class is same as entry in **contract.main.class** property in pom.xml's plugin section.

```
<contract.main.class>org.test.HelloAvm</contract.main.class>
```
**Class-Verifier for whitelist classes**

To enable class-verifier goal which verifies usage of allowed apis in the contract, you need to make sure that "class-verifier" goal is uncommented in pom.xml. This goal is executed during compile phase of maven build cycle.

```
<goal>class-verifier</goal>
```

---

### 3. Initialize and copy required AVM libraries
By default, the plugin will copy required avm jars to the lib folder under the project directory. But you can also point to a different avm lib folder by changing "avmLibDir" property in aion4j plugin configuration in pom.xml if you want to use a different version of AVM. But for now, let's use the default avm version bundled in the plugin.

```
$> mvn initialize
```

---

### 4. Build the project

```
$> mvn clean install
```
**Note:** During build, the plugin checks for apis which are not allowed in the java smart contract and shows the error accordingly.

**Note:** When you deploy

<a name="using_embedded"></a>

### 5. Include a custom smart contract

Navigate to the smart contract in the Maven Project, under src/main/java. Replace the existing java contract with the following code:
```

package example-contract;

import org.aion.avm.api.ABIDecoder;
import org.aion.avm.api.BlockchainRuntime;

public class HelloAvm
{

    public static String storage1;

    public static void sayHello() {
        BlockchainRuntime.println("Hello Avm");
    }

    public static String greet(String name) {
        return "Hello " + name + "!";
    }

    public static void setString(String stringToStore) {
        storage1 = stringToStore;

    }

    public static String getString() {
        return storage1;
    }  
    
    //main should be last function
    public static byte[] main() {
        return ABIDecoder.decodeAndRunWithClass(HelloAvm.class, BlockchainRuntime.getData());
    }
}


```
This new contract has additional setString and getString functions that can get and set values to the AVM testnet.

To compile your changes:

```
$> mvn initialize
$> mvn clean install

```

## Using Embedded AVM

---

### 1. Deploy your first AVM smart contract in an embedded AVM

```
$> mvn aion4j:deploy
```
**Note:** The deployer address is taken from the "&lt;localDefaultAddress&gt;" property in the plugin configuration section in pom.xml

To make the deployment process easier, by default, the plugin creates an account for the deployer if it is not there and allocate some balance to it.


---

### 2. Call a method in the smart contract
The archetype generated project comes with a sample java smart contract. To invoke "greet" method in the sample contract, run the aion4j:call maven goal.

```
$> mvn aion4j:call -Dmethod=greet -Dargs="-T AVM"
```
The output should be something similar:

[INFO] ****************  Method call result  ****************

[INFO] Data       : Hello AVM

[INFO] Energy used: 66414

[INFO] *********************************************************

---

The aion4j:call goal syntax is as below:

```
$> mvn aion4j:call -Dmethod=<method_name> -Dargs="<arg_type> <arg_value> <arg_type> <arg_value> ..."
```
**Note:** You can also optionally pass -Daddress=<address> if you don't want to use the "localDefaultAddress" mentioned in the plugin configuration in pom.xml.

The supported arg_types are

```
-I int
-J long
-S short
-C char
-F float
-D double
-B byte
-Z boolean
-A Address
-T String
```

---

### 3. Get the balance
To get the balance of the default address.

```
$> mvn aion4j:get-balance
```
You can pass -Daddress property to get balance of another account.
Example:
```
$> mvn aion4j:get-balance -Daddress=<address>
```
---

### 4. To create a new account with balance
This creates the specified account in storage with the provided balance for testing.
```
$> mvn aion4j:create-account -Daddress=a0xxxxx -Dbalance=<value>
```

<a name="using_remote"></a>

---

## Using Aion Kernel (AVM Testnet)
For remote deployment support, there is a separate &lt;profile&gt; section in the pom.xml with profile id "remote". So to trigger aion4j goals for remote Aion kernel, you need to pass "-Premote"  in the maven command.


Alternatively, you can change the "mode" property in the plugin configuration (pom.xml) to "remote" to enable remote deployment by default.

---

#### Web3 Rpc Url
The aion4j plugin needs the url to web3 rpc endpoint.

you can provide web3 rpc url information through
* -Dweb3rpc.url=http://host:port in maven command line
```
$> mvn aion4j:deploy -Dweb3rpc.url=http://<host>:<port> ...
```



beta - coming soon
```
<configuration>
      ...
      <web3rpcUrl>http://host:port</web3rpcUrl>
</configuration>
```

The testnet is called *avm-testnet* (not Mastery) and we will use tokens from this network, and deploy our contract to this network
to reach the avm testnet, use nodesmith https://dashboard.nodesmith.io
and change the "mainnet" portion of the url to "avmtestnet"


![Alt text](./img/nodesmith.png?raw=true "Title")

For more info, check out Aion docs: https://learn.aion.network/docs/nodesmith

---

#### Address
The aion4j maven goals use account address in different goals to do different operations. -
* -D properties in maven command.  
Example:
```
mvn aion4j:deploy -Daddress=ax000000 ...
```

---

### 1. Create account

We will create an account on a network, not just local.
Set a password of your choice, this is not a permanent workflow and is being updated

```
$> mvn aion4j:create-account -Dweb3rpc.url=http://host:port -Dpassword=test123 -Premote
```
Save the account address

---

### 2. Fund Account

We have to fund the account with testnet tokens.
You can fund with AIWA wallet extension (Metamask for Aion).
TAs will help you send tokens to your wallet address.

Send 1-2 tokens to your address from previous step.
Each transaction costs approx. 0.3 Aion.

Faucet instructions:
https://faucets.blockxlabs.com/
1. select Aion 
2. in network dropdown select avm-testnet
3. enter your address to fund. You can fund the address you created in previous step.

It will send you 1 testnet Aion in about 30 seconds


![Alt text](./img/faucet.png?raw=true "Title")

Aion docs will provide more information here: https://learn.aion.network/docs/faucet-get-your-testnet-aion-coins

---

### 3. To unlock the account and deploy, run


You can unlock the account explicitly and then deploy
```
$> mvn aion4j:unlock -Dweb3rpc.url=http://host:port -Daddress=ax00000 -Dpassword=<password> -Premote
$> mvn aion4j:deploy -Dweb3rpc.url=http://host:port -Daddress=ax00000 -Dpassword=<password> -Premote
```

#### To get balance
```
$> mvn aion4j:get-balance -Dweb3rpc.url=http://host:port -Daddress=a0xxxx -Premote
```

---

### 4. Get transaction receipt
Use the transaction hash from the above step to get the details.

```
$> mvn aion4j:get-receipt -DtxHash=<tx_hash> -Dweb3rpc.url=http://host:port -Premote
```
You should see a json output. Get the "contractAddress" value for the deployed contract address.

---

### 3. Call contract method
This goal makes a web3 rpc call for "eth_call" function to remote kernel.

```
$> mvn aion4j:call -Dweb3rpc.url=http://host:port -Daddress=a0xxxx -Dcontract=a0xxxxxx -Dmethod=greet -Dargs="-T AVMTestnet" [-Dvalue=<value>] -Premote
```

or, if web3rpc.url and address are set as environment variable or pom.xml, use following

```
mvn aion4j:call -Dcontract=a0xxxxxx -Dmethod=greet -Dargs="-T AVMTestnet" [-Dvalue=<value>] -Premote

```

Response is in Hex format, try to convert with online tool:
(remove the first 4 digits after the x)

http://string-functions.com/hex-string.aspx

---

### 4. Send contract transaction
This goal makes a web3 rpc call for "eth_sendTransaction" function to remote kernel

```
$> mvn aion4j:contract-txn -Dweb3rpc.url=http://host:port -Daddress=a0xxxx -Dcontract=a0xxxxxx -Dmethod=greet -Dargs="-T AVMTestnet" [-Dvalue=<value>] -Premote
```

or, if web3rpc.url and address are set as environment variable or pom.xml, use following

```
$> mvn aion4j:contract-txn -Dcontract=a0xxxxxx -Dmethod=greet -Dargs="-T AVMTestnet" [-Dvalue=<value>] -Premote
```

---

### 5. To transfer from one address to another

```
$> mvn aion4j:transfer -Dweb3rpc.url=http://host:port -Dfrom=a0xxx -Dto=a0xxxxxx -Dvalue=<value> -Dpassword=<password> -Premote
```



## Connect Front End with Smart Contract
- Install AIWA
- Add web3 source to front end
- Point your app to avm testnet and your contract
- transaction functions
- connect buttons to functions
- test the Dapp!

#### Install AIWA
Download and install the Aiwa browser extension. Available on Chrome.

https://chrome.google.com/webstore/detail/aiwa/objigohafkcoodmofgmifblmfidicehc?hl=en


#### Connect Aiwa to AVM testnet
use nodesmith url used in the remote call

#### Add Web3 to frontend

The beta version of web3 for avm is avilable at the aion repository below. 
(note: aionweb3 injected from AIWA will not have the avm module at the time of writing)
In index.html file, add  `<script type="text/javascript" src="./web3.min.js"></script>`
include web3.min.js in your dApp directory.
get the file here https://github.com/aion-kelvin/AvmFuntime/blob/master/myhack/web3.min.js


#### Set up a javascript file.

Create a file called index.js in the same folder as index.html.

Include index.js in index.HTML   `<script type="text/javascript" src="./index.js"></script>`

Declare your Web3 object `let web3 = new Web3(new Web3.providers.HttpProvider("http://138.91.123.106:8545"));`

create variables for the contract address, your address and your private key.

```

let contractAddress = "<address of the contract you deployed on Maven>";
let accountAddress = "<your aiwa address>";
let accountPK = "<your aiwa private key>";

```

#### Implement Javascript functions

Create a function to send a transaction to the contract we deployed previously. 
We use the avm methods of web3 to interact with the contract.
We will pass the method name (greet, setString, or getString), the argument type as "String" and the argument.
All our arguments are encoded to hex format, then decoded from hex 

```
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
```

Create different methods to call transactions based on what the user wants to send

```
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
```
#### connect buttons to functions
in index.html, add function calls to the buttons, like so
<button onclick="greet()">Greet</button>
<button onclick="setString()">set string</button>
<button onclick="getString()">get string</button>

Try it out by right clicking to open your developer console.
For the full code, try the sample projects in this repo.

#### test the dApp
`Serve the Dapp using python -m SimpleHTTPServer`








---
# why build with aion
## 1. Smart contracts in Java  = tools + faster development
## 2. Save your data to multiple blockchains = better Crash Fault Tolerance


http://string-functions.com/hex-string.aspx