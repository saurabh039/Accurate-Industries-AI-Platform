from collections import defaultdict


conversation_store = defaultdict(list)


def get_history(session_id):

    return conversation_store[session_id]


def add_message(session_id, role, content):

    conversation_store[session_id].append({

        "role": role,
        "content": content
    })


def clear_history(session_id):

    conversation_store[session_id] = []