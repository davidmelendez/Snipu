#[starknet::contract]
pub mod SnippetStorage {
    use core::starknet::storage::{Map, StoragePointerWriteAccess};
    use crate::interfaces::isnippet_storage::ISnippetStorage;
    use starknet::storage::{StorageMapReadAccess, StorageMapWriteAccess};
    use starknet::{ContractAddress, contract_address_const, get_caller_address};

    // errors
    mod errors {
        const ERR_NOT_AUTHORIZED: felt252 = 'Not authorized';
        const ERR_SNIPPET_NOT_FOUND: felt252 = 'Snippet not found';
    }

    #[storage]
    struct Storage {
        owner: ContractAddress,
        user_snippets: Map<ContractAddress, felt252>,
        snippet_store: Map<felt252, felt252>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        SnippetStored: SnippetStored,
        SnippetAdded: SnippetAdded,
        SnippetRemoved: SnippetRemoved,
        SnippetUpdated: SnippetUpdated,
    }

    #[derive(Drop, starknet::Event)]
    struct SnippetStored {
        user: ContractAddress,
        snippet_hash: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct SnippetAdded {
        snippet_id: felt252,
        snippet: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct SnippetRemoved {
        snippet_id: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct SnippetUpdated {
        snippet_id: felt252,
        new_snippet: felt252,
    }

    // Constructor
    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        assert(owner != contract_address_const::<0>(), 'Owner cannot be zero');
        self.owner.write(owner);
    }


    #[abi(embed_v0)]
    pub impl SnippetStorageImpl of ISnippetStorage<ContractState> {
        fn store_snippet(ref self: ContractState, snippet_hash: felt252) {
            let caller = get_caller_address();
            self.user_snippets.write(caller, snippet_hash);

            self.emit(SnippetStored { user: caller, snippet_hash: snippet_hash });
        }

        fn get_snippet(self: @ContractState, user: ContractAddress) -> felt252 {
            self.user_snippets.read(user)
        }

        fn get_snippet_by_id(self: @ContractState, snippet_id: felt252) -> felt252 {
            self.snippet_store.read(snippet_id)
        }

        fn add_snippet(ref self: ContractState, snippet_id: felt252, snippet: felt252) {
            self.snippet_store.write(snippet_id, snippet);

            self.emit(SnippetAdded { snippet_id: snippet_id, snippet: snippet });
        }

        fn remove_snippet(ref self: ContractState, snippet_id: felt252) {
            self.snippet_store.write(snippet_id, 0);

            self.emit(SnippetRemoved { snippet_id: snippet_id });
        }

        fn update_snippet(ref self: ContractState, snippet_id: felt252, new_snippet: felt252) {
            self.snippet_store.write(snippet_id, new_snippet);

            self.emit(SnippetUpdated { snippet_id: snippet_id, new_snippet: new_snippet });
        }
    }
}
