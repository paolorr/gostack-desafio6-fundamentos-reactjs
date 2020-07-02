import React, { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(e: FormEvent): Promise<void> {
    e.preventDefault();

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return;
    }

    const data = new FormData();
    data.append('file', uploadedFiles[0].file);

    try {
      await api.post('/transactions/import', data);
      history.push('/');
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    // const filteredFiles = files.filter(
    //   file1 => !uploadedFiles.some(file2 => file2.name === file1.name),
    // );

    // const mappedFiles = filteredFiles.map(file => ({
    //   file,
    //   name: file.name,
    //   readableSize: file.size.toString(),
    // }));

    setUploadedFiles([
      {
        file: files[0],
        name: files[0].name,
        readableSize: filesize(files[0].size, { locale: 'pt-BR' }),
      },
    ]);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button
              onClick={handleUpload}
              type="button"
              disabled={!uploadedFiles || uploadedFiles.length === 0}
            >
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
