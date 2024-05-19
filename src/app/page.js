"use client"
import React, { useEffect, useState } from 'react'
import { authStateListener, logout } from './libs/auth';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './libs/firebase';

function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [modalActive, setModalActive] = useState(false)

  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [date, setDate] = useState("")
  const [saveLoading, setSaveLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = authStateListener((user) => {
      setUser(user);
      setLoading(false)
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div>Loading the page</div>
    )
  }

  if (!user) {
    router.push("/login")
  }

  async function saveHandler(e) {
    e.preventDefault();
    console.log("SAVE HANDLER")
    setSaveLoading(true)
    try {
      await addDoc(collection(db, "members"), {
        name : name,
        contact : contact,
        joining_date : date
      })  
      console.log("added data")
    } catch (e) {
      console.log("got an error", e) 
    } finally {
      setSaveLoading(false)
      setModalActive(false)
      setName('')
      setContact("")
      setDate("")
    }
  }

  return (
    <div>
      <div>
        <div className="toast toast-top">
          <div className="alert alert-success">
            <span>New message arrived.</span>
          </div>
        </div>

        <div className="toast toast-top">
          <div className="alert alert-error">
            <span>New message arrived.</span>
          </div>
        </div>
      </div>
     
      <button className='btn btn-primary' onClick={() => {
        logout()
      }}>Logout</button>
      <Modal active={modalActive}>
        <div>
          <h1 className='text-xl mb-2'>Create Member</h1>
          <form className='form-control flex flex-col gap-2' onSubmit={saveHandler}>
            <label className="input input-bordered flex flex-col gap-2">
              <input type="text" className="grow" placeholder="Name" onChange={(e)=> setName(e.target.value)} />
            </label>
            <label className="input input-bordered flex flex-col gap-2">
              <input type="text" className="grow" placeholder="Contact" onChange={(e) => setContact(e.target.value)} />
            </label>
            <label className="input input-bordered flex flex-col gap-2">
              <input type="text" className="grow" placeholder="Joining Date" onChange={(e) => setDate(e.target.value)} />
            </label>
          </form>
          <div className='mt-4 flex flex-row justify-between'>
            <button className='btn btn-neutral	' onClick={() => setModalActive(false)}>Close</button>
            <button className='btn btn-primary' type='submit' onClick={saveHandler}>
              Save
              {saveLoading && <span className="loading loading-spinner"></span>}
            </button>
          </div>
        </div>
      </Modal>

      <button className='btn btn-primary' onClick={() => setModalActive(true)}>
        Open
      </button>
    </div>
  )
}

export default Home