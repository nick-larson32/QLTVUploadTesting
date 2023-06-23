'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid'

function Dropzone({ className }) {

  const [files, setFiles] = useState([])
  const [rejected, setRejected] = useState([])


  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles(previousFiles => [
        ...previousFiles,
        ...acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))
      ])
    }
    // console.log(acceptedFiles)
    // Do something with the files
    if (rejectedFiles?.length) {
      setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
    }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const removeFile = (name) => {
    setFiles(files => files.filter(file => file.name !== name))
  }

  const removeRejected = name => {
    setRejected(files => files.filter(({ file }) => file.name !== name))
  }

  return (
    <form>
      <div
        {...getRootProps({
          className: className
        })}
      >
        <input {...getInputProps()} />
        <div className='flex flex-col items-center justify-center gap-4'>
          <ArrowUpTrayIcon className='w-5 h-5 fill-current' />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag & drop files here, or click to select files</p>
          )}
        </div>
      </div>
      {/* Accepted files */}
      <h3 className='title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3'>
        Accepted Files
      </h3>
      <ul className='mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
        {files.map(file => (
          <li key={file.name} className='relative h-32 rounded-md shadow-lg'>
            <Image
              src={file.preview}
              alt={file.name}
              width={100}
              height={100}
              onLoad={() => {
                URL.revokeObjectURL(file.preview)
              }}
              className='h-full w-full rounded-md object-contain'
            />
            <button
              type='button'
              className='absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border border-rose-400 bg-rose-400 transition-colors hover:bg-white'
              onClick={() => removeFile(file.name)}
            >
              <XMarkIcon className='h-5 w-5 fill-white transition-colors hover:fill-rose-400' />
            </button>
            <p className='mt-2 text-[12px] font-medium text-stone-500'>
              {file.name}
            </p>
          </li>
        ))}
      </ul>

       {/* Rejected Files */}
       <h3 className='title text-lg font-semibold text-neutral-600 mt-24 border-b pb-3'>
          Rejected Files
        </h3>
        <ul className='mt-6 flex flex-col'>
          {rejected.map(({ file, errors }) => (
            <li key={file.name} className='flex items-start justify-between'>
              <div>
                <p className='mt-2 text-neutral-500 text-sm font-medium'>
                  {file.name}
                </p>
                <ul className='text-[12px] text-red-400'>
                  {errors.map(error => (
                    <li key={error.code}>{error.message}</li>
                  ))}
                </ul>
              </div>
              <button
                type='button'
                className='mt-1 py-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-white transition-colors'
                onClick={() => removeRejected(file.name)}
              >
                remove
              </button>
            </li>
          ))}
        </ul>
    </form>
  )
}

export default Dropzone