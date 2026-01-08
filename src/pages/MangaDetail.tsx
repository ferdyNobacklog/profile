import { useParams, useNavigate } from 'react-router-dom'
import MangaDetailComponent from '../components/MangaDetail'

const MangaDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) {
    navigate('/manga')
    return null
  }

  return <MangaDetailComponent mangaId={parseInt(id)} />
}

export default MangaDetailPage

