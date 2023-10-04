import type { Keyring } from './api';
import type { JsonRpcRequest } from './JsonRpcRequest';
import {
  KeyringRpcMethod,
  MethodNotSupportedError,
  handleKeyringRequest,
  isKeyringRpcMethod,
} from './rpc-handler';

describe('keyringRpcDispatcher', () => {
  const keyring = {
    listAccounts: jest.fn(),
    getAccount: jest.fn(),
    createAccount: jest.fn(),
    filterAccountChains: jest.fn(),
    updateAccount: jest.fn(),
    deleteAccount: jest.fn(),
    exportAccount: jest.fn(),
    listRequests: jest.fn(),
    getRequest: jest.fn(),
    submitRequest: jest.fn(),
    approveRequest: jest.fn(),
    rejectRequest: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call keyring_listAccounts', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_listAccounts',
    };

    keyring.listAccounts.mockResolvedValue('ListAccounts result');
    const result = await handleKeyringRequest(keyring, request);

    expect(keyring.listAccounts).toHaveBeenCalled();
    expect(result).toBe('ListAccounts result');
  });

  it('should fail to call keyringRpcDispatcher with a non-JSON-RPC request', async () => {
    const request = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      // Missing method name.
    };

    await expect(
      handleKeyringRequest(keyring, request as unknown as JsonRpcRequest),
    ).rejects.toThrow(
      'At path: method -- Expected a string, but received: undefined',
    );
  });

  it('should call keyring_getAccount', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_getAccount',
      params: { id: '4f983fa2-4f53-4c63-a7c2-f9a5ed750041' },
    };

    keyring.getAccount.mockResolvedValue('GetAccount result');
    const result = await handleKeyringRequest(keyring, request);

    expect(keyring.getAccount).toHaveBeenCalledWith(
      '4f983fa2-4f53-4c63-a7c2-f9a5ed750041',
    );
    expect(result).toBe('GetAccount result');
  });

  it('should fail to call keyring_getAccount without the account ID', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_getAccount',
      params: {}, // Missing account ID.
    };

    await expect(handleKeyringRequest(keyring, request)).rejects.toThrow(
      'At path: params.id -- Expected a string, but received: undefined',
    );
  });

  it('should fail to call keyring_getAccount without params', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_getAccount',
    };

    await expect(handleKeyringRequest(keyring, request)).rejects.toThrow(
      'At path: params -- Expected an object, but received: undefined',
    );
  });

  it('should call keyring_createAccount', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_createAccount',
      params: { options: {} },
    };

    keyring.createAccount.mockResolvedValue('CreateAccount result');
    const result = await handleKeyringRequest(keyring, request);

    expect(keyring.createAccount).toHaveBeenCalledWith({});
    expect(result).toBe('CreateAccount result');
  });

  it('should call keyring_filterAccountChains', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_filterAccountChains',
      params: {
        id: '4f983fa2-4f53-4c63-a7c2-f9a5ed750041',
        chains: ['chain1', 'chain2'],
      },
    };

    keyring.filterAccountChains.mockResolvedValue(
      'FilterSupportedChains result',
    );
    const result = await handleKeyringRequest(keyring, request);

    expect(keyring.filterAccountChains).toHaveBeenCalledWith(
      '4f983fa2-4f53-4c63-a7c2-f9a5ed750041',
      ['chain1', 'chain2'],
    );
    expect(result).toBe('FilterSupportedChains result');
  });

  it('should call keyring_updateAccount', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_updateAccount',
      params: {
        account: {
          id: '4f983fa2-4f53-4c63-a7c2-f9a5ed750041',
          address: '0x0',
          options: {},
          methods: [],
          type: 'eip155:eoa',
        },
      },
    };

    keyring.updateAccount.mockResolvedValue('UpdateAccount result');
    const result = await handleKeyringRequest(keyring, request);

    expect(keyring.updateAccount).toHaveBeenCalledWith({
      id: '4f983fa2-4f53-4c63-a7c2-f9a5ed750041',
      address: '0x0',
      options: {},
      methods: [],
      type: 'eip155:eoa',
    });
    expect(result).toBe('UpdateAccount result');
  });

  it('should call keyring_deleteAccount', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_deleteAccount',
      params: { id: '4f983fa2-4f53-4c63-a7c2-f9a5ed750041' },
    };

    keyring.deleteAccount.mockResolvedValue('DeleteAccount result');
    const result = await handleKeyringRequest(keyring, request);

    expect(keyring.deleteAccount).toHaveBeenCalledWith(
      '4f983fa2-4f53-4c63-a7c2-f9a5ed750041',
    );
    expect(result).toBe('DeleteAccount result');
  });

  it('should call keyring_exportAccount', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_exportAccount',
      params: { id: '4f983fa2-4f53-4c63-a7c2-f9a5ed750041' },
    };
    const expected = {
      privateKey: '0x0123',
    };

    keyring.exportAccount.mockResolvedValue(expected);
    const result = await handleKeyringRequest(keyring, request);

    expect(keyring.exportAccount).toHaveBeenCalledWith(
      '4f983fa2-4f53-4c63-a7c2-f9a5ed750041',
    );
    expect(result).toStrictEqual(expected);
  });

  it('should throw MethodNotSupportedError if exportAccount is not implemented', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_exportAccount',
      params: { id: '4f983fa2-4f53-4c63-a7c2-f9a5ed750041' },
    };

    const partialKeyring: Keyring = {
      ...keyring,
    };
    delete partialKeyring.exportAccount;

    await expect(handleKeyringRequest(partialKeyring, request)).rejects.toThrow(
      MethodNotSupportedError,
    );
  });

  it('should call keyring_listRequests', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_listRequests',
    };

    keyring.listRequests.mockResolvedValue('ListRequests result');
    const result = await handleKeyringRequest(keyring, request);

    expect(keyring.listRequests).toHaveBeenCalled();
    expect(result).toBe('ListRequests result');
  });

  it('should throw MethodNotSupportedError if listRequests is not implemented', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_listRequests',
    };

    const partialKeyring: Keyring = {
      ...keyring,
    };
    delete partialKeyring.listRequests;

    await expect(handleKeyringRequest(partialKeyring, request)).rejects.toThrow(
      MethodNotSupportedError,
    );
  });

  it('should call keyring_getRequest', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_getRequest',
      params: { id: 'request_id' },
    };

    keyring.getRequest.mockResolvedValue('GetRequest result');
    const result = await handleKeyringRequest(keyring, request);

    expect(keyring.getRequest).toHaveBeenCalledWith('request_id');
    expect(result).toBe('GetRequest result');
  });

  it('should throw MethodNotSupportedError if getRequest is not implemented', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_getRequest',
      params: { id: 'request_id' },
    };

    const partialKeyring: Keyring = {
      ...keyring,
    };
    delete partialKeyring.getRequest;

    await expect(handleKeyringRequest(partialKeyring, request)).rejects.toThrow(
      MethodNotSupportedError,
    );
  });

  it('should call keyring_submitRequest', async () => {
    const dappRequest = {
      id: 'c555de37-cf4b-4ff2-8273-39db7fb58f1c',
      scope: 'eip155:1',
      account: '4abdd17e-8b0f-4d06-a017-947a64823b3d',
      request: {
        method: 'eth_method',
        params: [1, 2, 3],
      },
    };

    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_submitRequest',
      params: dappRequest,
    };

    keyring.submitRequest.mockResolvedValue('SubmitRequest result');
    const result = await handleKeyringRequest(keyring, request);

    expect(keyring.submitRequest).toHaveBeenCalledWith(dappRequest);
    expect(result).toBe('SubmitRequest result');
  });

  it('should call keyring_approveRequest', async () => {
    const payload = { id: 'request_id', data: { signature: '0x0123' } };
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_approveRequest',
      params: payload,
    };

    keyring.approveRequest.mockResolvedValue('ApproveRequest result');
    const result = await handleKeyringRequest(keyring, request);

    expect(keyring.approveRequest).toHaveBeenCalledWith(
      payload.id,
      payload.data,
    );
    expect(result).toBe('ApproveRequest result');
  });

  it('should throw MethodNotSupportedError if approveRequest is not implemented', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_approveRequest',
      params: { id: 'request_id', data: {} },
    };

    const partialKeyring: Keyring = {
      ...keyring,
    };
    delete partialKeyring.approveRequest;

    await expect(handleKeyringRequest(partialKeyring, request)).rejects.toThrow(
      MethodNotSupportedError,
    );
  });

  it('should fail to list requests with a non-UUIDv4 request ID', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 'invalid-id-string',
      method: 'keyring_listRequests',
    };

    await expect(handleKeyringRequest(keyring, request)).rejects.toThrow(
      'At path: id -- Expected a string matching',
    );
  });

  it('should call keyring_rejectRequest', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_rejectRequest',
      params: { id: 'request_id' },
    };

    keyring.rejectRequest.mockResolvedValue('RejectRequest result');
    const result = await handleKeyringRequest(keyring, request);

    expect(keyring.rejectRequest).toHaveBeenCalledWith('request_id');
    expect(result).toBe('RejectRequest result');
  });

  it('should throw MethodNotSupportedError if rejectRequest is not implemented', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'keyring_rejectRequest',
      params: { id: 'request_id' },
    };

    const partialKeyring: Keyring = {
      ...keyring,
    };
    delete partialKeyring.rejectRequest;

    await expect(handleKeyringRequest(partialKeyring, request)).rejects.toThrow(
      MethodNotSupportedError,
    );
  });

  it('should throw MethodNotSupportedError for an unknown method', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: '7c507ff0-365f-4de0-8cd5-eb83c30ebda4',
      method: 'unknown_method',
    };

    await expect(handleKeyringRequest(keyring, request)).rejects.toThrow(
      MethodNotSupportedError,
    );
  });
});

describe('isKeyringRpcMethod', () => {
  it.each([
    [`${KeyringRpcMethod.ListAccounts}`, true],
    [`${KeyringRpcMethod.GetAccount}`, true],
    [`${KeyringRpcMethod.CreateAccount}`, true],
    [`${KeyringRpcMethod.FilterAccountChains}`, true],
    [`${KeyringRpcMethod.UpdateAccount}`, true],
    [`${KeyringRpcMethod.DeleteAccount}`, true],
    [`${KeyringRpcMethod.ListRequests}`, true],
    [`${KeyringRpcMethod.GetAccount}`, true],
    [`${KeyringRpcMethod.ApproveRequest}`, true],
    [`${KeyringRpcMethod.RejectRequest}`, true],
    [`keyring_invalid`, false],
  ])(`%s should be %s`, (method, expected) => {
    expect(isKeyringRpcMethod(method)).toBe(expected);
  });
});