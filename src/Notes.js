import React, {useEffect, useState} from 'react'
import {Editor} from './Editor.js'
import { getFirestore, collection, setDoc, doc, onSnapshot } from 'firebase/firestore'
import parser from 'html-react-parser'

export const Notes = ({user}) => {
    const [note, setNote] = useState("")
    const [notes, setNotes] = useState([])

    const addNote = () => {
        const fs = getFirestore()
        const docKey = [user.uid, 'my_notes', new Date().getTime()].join('/')
        const docRef = doc(fs, 'notes', docKey)
        setDoc(docRef, {note}).then(() => setNote(""))
    }

    useEffect(() => {
        const fs = getFirestore()
        onSnapshot(collection(fs, `notes/${user.uid}/my_notes`), snapshot => {
            const _notes = snapshot.docs.map(_doc => {
                // {id: 12789361827, note: '<p>hello you</p>'}
                return {id: _doc.id, note: _doc.data().note}
            })
            setNotes(_notes)
        })
    }, [user.uid])

    const onDelete = key => {
        console.log('docRef', key)
    }

    return (
        <section>
            <main>
                {notes.map((n, i) => {
                    return <article onClick={() => onDelete(`notes/${user.uid}/my_notes/${n.id}`)} key={`note-${i}`}>{parser(n.note)}</article>
                })}
            </main>
            <Editor onChange={setNote} defaultValue={note} />
            <button onClick={addNote}>Add Note</button>
        </section>

    )
}