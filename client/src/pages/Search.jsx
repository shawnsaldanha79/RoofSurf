import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Search() {
    const navigate = useNavigate()
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order: 'desc',
    })
    const [loading, setLoading] = useState(false)
    const [listings, setListings] = useState([])
    console.log(listings);
    
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const typeFromUrl = urlParams.get('type')
        const parkingFromUrl = urlParams.get('parking')
        const furnishedFromUrl = urlParams.get('furnished')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')
        if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'createdAt',
                order: orderFromUrl || 'desc',
            })
        }
        const fetchListings = async() => {
            setLoading(true)
            const searchQuery = urlParams.toString()
            const res = await fetch(`/api/listing/get?${searchQuery}`)
            const data = await res.json()
            setListings(data)
            setLoading(false)
        }
        fetchListings()
    }, [location.search])

    const handleChange = (evt) => {
        if (evt.target.id === 'all' || evt.target.id === 'rent' || evt.target.id === 'sale') {
            setSidebarData({
                ...sidebarData,
                type: evt.target.id,
            })
        }
        if (evt.target.id === 'searchTerm') {
            setSidebarData({
                ...sidebarData,
                searchTerm: evt.target.value,
            })
        }
        if (evt.target.id === 'parking' || evt.target.id === 'furnished' || evt.target.id === 'offer') {
            setSidebarData({
                ...sidebarData,
                [evt.target.id]: evt.target.checked || evt.target.checked === 'true' ? true : false,
            })
        }
        if (evt.target.id === 'sort_order') {
            const sort = evt.target.value.split('_')[0] || 'createdAt'
            const order = evt.target.value.split('_')[1] || 'desc'
            setSidebarData({
                ...sidebarData,
                sort: sort,
                order: order,
            })
        }
    }
    const handleSubmit = (evt) => {
        evt.preventDefault()
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', sidebarData.searchTerm)
        urlParams.set('type', sidebarData.type)
        urlParams.set('parking', sidebarData.parking)
        urlParams.set('furnished', sidebarData.furnished)
        urlParams.set('offer', sidebarData.offer)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('order', sidebarData.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }
    return (
      <div className='flex flex-col md:flex-row'>
          <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
              <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                  <div className='flex items-center gap-2 p'>
                      <label className='whitespace-nowrap font-semibold'>Search Term: </label>
                      <input type="text" id='searchTerm' placeholder='Search...' className='border rounded-lg p-3 w-full' 
                      onChange={handleChange} value={sidebarData.searchTerm}/>
                  </div>
                  <div className='flex gap-2 flex-wrap items-center'>
                      <label className='font-semibold'>Type: </label>
                      <div className='flex gap-2'>
                          <input type="checkbox" id="all" className='w-5' onChange={handleChange} checked={sidebarData.type === 'all'}/>
                          <span>Rent & Sale</span>
                      </div>
                      <div className='flex gap-2'>
                          <input type="checkbox" id="rent" className='w-5' onChange={handleChange} checked={sidebarData.type === 'rent'}/>
                          <span>Rent</span>
                      </div>
                      <div className='flex gap-2'>
                          <input type="checkbox" id="sale" className='w-5' onChange={handleChange} checked={sidebarData.type === 'sale'}/>
                          <span>Sale</span>
                      </div>
                      <div className='flex gap-2'>
                          <input type="checkbox" id="offer" className='w-5' onChange={handleChange} checked={sidebarData.offer}/>
                          <span>Offer</span>
                      </div>
                  </div>
                  <div className='flex gap-2 flex-wrap items-center'>
                      <label className='font-semibold'>Amenities: </label>
                      <div className='flex gap-2'>
                          <input type="checkbox" id="parking" className='w-5'onChange={handleChange} checked={sidebarData.parking}/>
                          <span>Parking</span>
                      </div>
                      <div className='flex gap-2'>
                          <input type="checkbox" id="furnished" className='w-5' onChange={handleChange} checked={sidebarData.furnished}/>
                          <span>Furnished</span>
                      </div>
                  </div>
                  <div className='flex items-center gap-2'>
                      <label className='font-semibold'>Sort: </label>
                      <select id="sort_order" className='border rounded-lg p-3' onChange={handleChange} defaultValue={'createdAt_desc'}>
                          <option value="createdAt_desc">Latest</option>
                          <option value="createdAt_asc">Oldest</option>
                          <option value="regularPrice_desc">Price high to low</option>
                          <option value="regularPrice_asc">Price low to high</option>
                      </select>
                  </div>
                  <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>Search</button>
              </form>
          </div>
          <div className=''>
              <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing Results: </h1>
          </div>
      </div>
    )
}
