// snippet_storage_test.cairo
use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address,
    stop_cheat_caller_address,
};
use snippet_storage::interfaces::isnippet_storage::{
    ISnippetStorageDispatcher, ISnippetStorageDispatcherTrait,
};
use starknet::{ContractAddress, contract_address_const};

// Helper to initialize contract with default owner(if at anypoint needed!)
fn init_contract() -> ISnippetStorageDispatcher {
    let owner = contract_address_const::<12345>();
    let contract_class = declare("SnippetStorage").unwrap().contract_class();
    let (contract_address, _) = contract_class.deploy(@array![owner.into()]).unwrap();
    ISnippetStorageDispatcher { contract_address }
}

// Helper addresses
fn user_a() -> ContractAddress {
    contract_address_const::<67890>()
}
fn user_b() -> ContractAddress {
    contract_address_const::<54321>()
}

#[test]
fn test_constructor_rejects_zero_address() {
    let contract_class = declare("SnippetStorage").unwrap().contract_class();
    let zero_address = contract_address_const::<0>();
    let deploy_result = contract_class.deploy(@array![zero_address.into()]);

    // Check deployment failed
    assert(deploy_result.is_err(), 'Deployment should have failed');

    // Extract panic data and verify it contains the expected error
    let panic_data = deploy_result.unwrap_err();
    assert(*panic_data.at(0) == 'Owner cannot be zero', 'Incorrect panic data');
}

#[test]
fn test_store_and_retrieve_snippet() {
    let contract = init_contract();
    let snippet_hash = 42;

    // User A stores snippet
    start_cheat_caller_address(contract.contract_address, user_a());
    contract.store_snippet(snippet_hash);
    stop_cheat_caller_address(contract.contract_address);

    // Verify retrieval
    let stored_hash = contract.get_snippet(user_a());
    assert(stored_hash == snippet_hash, 'Stored hash mismatch');
}

#[test]
fn test_snippet_lifecycle() {
    let contract = init_contract();
    let snippet_id = 1;
    let initial_content = 100;
    let updated_content = 200;

    // Add initial snippet
    contract.add_snippet(snippet_id, initial_content);
    assert(contract.get_snippet_by_id(snippet_id) == initial_content, 'Add failed');

    // Update snippet
    contract.update_snippet(snippet_id, updated_content);
    assert(contract.get_snippet_by_id(snippet_id) == updated_content, 'Update failed');

    // Remove snippet
    contract.remove_snippet(snippet_id);
    assert(contract.get_snippet_by_id(snippet_id) == 0, 'Remove failed');
}

#[test]
fn test_event_functionality() {
    let contract = init_contract();
    let snippet_id = 5;
    let content = 500;
    let updated_content = content + 1;

    // Test store_snippet functionality
    start_cheat_caller_address(contract.contract_address, user_b());
    contract.store_snippet(content);
    assert(contract.get_snippet(user_b()) == content, 'Store snippet failed');

    // Test add_snippet functionality
    contract.add_snippet(snippet_id, content);
    assert(contract.get_snippet_by_id(snippet_id) == content, 'Add snippet failed');

    // Test update_snippet functionality
    contract.update_snippet(snippet_id, updated_content);
    assert(contract.get_snippet_by_id(snippet_id) == updated_content, 'Update snippet failed');

    // Test remove_snippet functionality
    contract.remove_snippet(snippet_id);
    assert(contract.get_snippet_by_id(snippet_id) == 0, 'Remove snippet failed');

    stop_cheat_caller_address(contract.contract_address);
}

#[test]
fn test_multiple_users() {
    let contract = init_contract();
    let hash_a = 111;
    let hash_b = 222;

    // User A stores
    start_cheat_caller_address(contract.contract_address, user_a());
    contract.store_snippet(hash_a);

    // User B stores
    start_cheat_caller_address(contract.contract_address, user_b());
    contract.store_snippet(hash_b);

    // Verify separate storage
    assert(contract.get_snippet(user_a()) == hash_a, 'User A data corrupted');
    assert(contract.get_snippet(user_b()) == hash_b, 'User B data corrupted');
}
