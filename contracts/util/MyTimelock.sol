// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract MyTimelock {

    /** 
     * The purpose of timelock is to delay a transaction
     * queue(broadcast) a transaction and wait a certain amount of time and then execute the transaction
     * this will increase a credibility of your contract since any malicious txs that might have occured
     * also be delayed before execution. 
     */

    error NotOwnerError();
    error AlreadyQueuedError(bytes32 txId);
    error TimestampNotInRangeError(uint256 timestamp, uint256 _timestamp);
    error NotQueuedError(bytes32 txId);
    error TimestampNotPassedError(uint256 timestamp, uint256 _timestamp);
    error TimestampExpiredError(uint256 timestamp, uint256 expiresAt);
    error TxFailedError();

    event Queue(bytes32 indexed _txId, address _target, uint256 _value, string _func, bytes _data, uint256 _timestamp);
    event Execute(bytes32 indexed _txId, address _target, uint256 _value, string _func, bytes _data, uint256 _timestamp);
    event Cancel(bytes32 indexed _txId); 

    uint256 public constant MIN_DELAY = 10 seconds;
    uint256 public constant MAX_DELAY = 1000 seconds;
    uint256 public constant GRACE_PERIOD = 1000 seconds;

    address public owner;
    mapping(bytes32 => bool) public queued;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwnerError({

            });
        }
        _;
    }

    function getTxId(
        address _target, 
        uint256 _value, 
        string calldata _func, 
        bytes calldata _data,
        uint256 _timestamp
    ) public pure returns(bytes32) {
        return keccak256(
            abi.encode(_target, _value, _func, _data, _timestamp)
        );
    }

    function queue(
        address _target, 
        uint256 _value, 
        string calldata _func, 
        bytes calldata _data,
        uint256 _timestamp
    ) external onlyOwner {
        bytes32 txId = getTxId(_target, _value, _func, _data, _timestamp);

        // error handling: check tx queue
        if (queued[txId]) {
            revert AlreadyQueuedError(txId);
        }

        // error handling: check timestamp limit
        if (
            _timestamp < block.timestamp + MIN_DELAY || 
            _timestamp > block.timestamp + MAX_DELAY
        ) {
            revert TimestampNotInRangeError(block.timestamp, _timestamp);
        }

        queued[txId] = true;

        emit Queue(txId, _target, _value, _func, _data, _timestamp);

    }

    function execute(
        address _target, 
        uint256 _value, 
        string calldata _func, 
        bytes calldata _data,
        uint256 _timestamp
    ) external payable onlyOwner returns(bytes memory) {
        bytes32 txId = getTxId(_target, _value, _func, _data, _timestamp);

        if (!queued[txId]) {
            revert NotQueuedError(txId);
        }

        if (block.timestamp < _timestamp) {
            revert TimestampNotPassedError(block.timestamp, _timestamp);
        }

        // grace period: where the execution of the queued transactions are valid 
        if (block.timestamp > _timestamp + GRACE_PERIOD) {
            revert TimestampExpiredError(block.timestamp, _timestamp + GRACE_PERIOD);
        }

        queued[txId] = false;

        bytes memory data;

        /// @dev case 1: when data sent is not empty
        if (bytes(_func).length > 0) {
            data = abi.encodePacked(bytes4(keccak256(bytes(_func))), _data);
        } else {
            data = _data;
        }

        /// @dev case 2: when data sent is empty
        (bool ok, bytes memory result) = _target.call{value: _value}(data); 

        if (!ok) {
            revert TxFailedError();
        }

        emit Execute(txId, _target, _value, _func, _data, _timestamp);

        return result;
    }

    function cancel(bytes32 _txId) external onlyOwner {
        if (!queued[_txId]) {
            revert NotQueuedError(_txId);
        }

        queued[_txId] = false;

        emit Cancel(_txId);
    }
}

contract TestMyTimelock {
    address public myTimeLock;

    constructor (address _myTimeLock) {
        myTimeLock = _myTimeLock;
    }

    function test() external view {
        require(msg.sender == myTimeLock);

        // add more logics here
    }

    function getTimestampPlus100() external view returns(uint256) {
        return block.timestamp + 100 seconds;
    }
}