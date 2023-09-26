import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import express from "express";
import { ethers } from "hardhat";
import request from "supertest";

const app = express();

app.post("/receive", (req, res) => {
  let decoded: string = "";

  req.on("data", (data: Buffer) => {
    console.log("request start");
    // get raw binary data and decode to string
    const _decoded = data.toString("utf-8");
    decoded = _decoded;
  });

  req.on("end", () => {
    console.log("request done");
    console.log("parsed: ", JSON.parse(decoded));
    const _data = JSON.parse(decoded);
    res.status(201).json({ data: _data });
  });
});

const appName = "plain-server";
const PREFIX = `integ-${appName}`;

const useFixture = async () => {
  const contract = await ethers.deployContract("Box");
  await contract.waitForDeployment();

  const [owner] = await ethers.getSigners();
  return { contract, owner };
};

describe(`${PREFIX}-Should test app for integration`, function TestIntegration() {
  const routes = {
    post: "/receive",
  };

  it.only("Should send post request and get response", async function TestPostRequest() {
    const { contract, owner } = await loadFixture(useFixture);

    let expectedName = "jake";

    interface PostResponse {
      data: {
        name: string;
      };
    }

    // @dev send HTTP request
    // prettier-ignore
    request(app)
        .post(routes.post)
        .send({ name: "jake" })
        .expect(201)
        .expect("Content-Type", "application/json; charset=utf-8")
        .end(function (err, res) {
          if (err) console.log(err)
          if (res) {
            const { body } = res
            const __body = body as unknown as PostResponse
            
            const __name = __body.data.name
            expect(__name).to.equal(expectedName)
          }
        })

    // @dev receive response and use it as contract args
    expect(await contract.name()).to.equal("none");

    await contract.setName(expectedName);

    expect(await contract.name()).to.equal(expectedName);
  });
});
