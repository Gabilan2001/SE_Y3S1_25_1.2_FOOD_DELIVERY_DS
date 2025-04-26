import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/Summary'
import { Link, useParams } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const params = useParams()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCategory, setDisplaySubCategory] = useState([])

  const subCategory = params?.subCategory?.split('-')
  const subCategoryName = subCategory
    ?.slice(0, subCategory?.length - 1)
    ?.join(' ')

  const categoryId = params.category.split('-').slice(-1)[0]
  const subCategoryId = params.subCategory.split('-').slice(-1)[0]

  const fetchProductdata = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId,
          subCategoryId,
          page,
          limit: 8,
        },
      })
      const { data: responseData } = response
      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data)
        } else {
          setData(prevData => [...prevData, ...responseData.data])
        }
        setTotalPage(responseData.totalCount)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductdata()
  }, [params])

  useEffect(() => {
    const sub = AllSubCategory.filter(s =>
      s.category.some(el => el._id === categoryId)
    )
    setDisplaySubCategory(sub)
  }, [params, AllSubCategory])

  return (
    <div className="pt-24">
      <section>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr] gap-6 p-4">
          {/** Sidebar for Subcategories **/}
          <div className="bg-white shadow-lg p-6 rounded-lg overflow-y-auto max-h-[80vh]">
            <h3 className="font-semibold text-xl text-gray-700 mb-4">
              Subcategories
            </h3>
            {DisplaySubCategory.length > 0 ? (
              DisplaySubCategory.map(s => {
                const link = `/${valideURLConvert(
                  s?.category[0]?.name
                )}-${s?.category[0]?._id}/${valideURLConvert(s.name)}-${s._id}`
                return (
                  <Link
                  key={s._id}
                  to={link}
                  className={`flex flex-col items-center p-3 mb-2 rounded-lg transition ${
                    subCategoryId === s._id
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'hover:bg-green-50'
                  }`}
                >
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-16 h-16 object-cover rounded-full border border-gray-300"
                  />
                  <p className="mt-2 text-gray-800 text-base font-medium text-center">
                    {s.name}
                  </p>
                </Link>
                
                )
              })
            ) : (
              <p className="text-gray-500">No subcategories available.</p>
            )}
          </div>

          {/** Product Grid **/}
          <div>
            <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-2xl text-gray-800">
                {subCategoryName || 'Products'}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {data.length > 0 ? (
                data.map((product, index) => (
                  <CardProduct
                    key={`${product._id}-productSubCategory-${index}`}
                    data={{
                      ...product,
                      imageClass:
                        'w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover rounded-lg',
                    }}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No products found.
                </p>
              )}
            </div>
            {loading && (
              <div className="mt-6 flex justify-center">
                <Loading />
              </div>
            )}
            {page < totalPage && (
              <div className="mt-6 flex justify-center">
                <button
                  className={`bg-green-500 text-white font-medium py-2 px-6 rounded-lg transition ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
                  }`}
                  disabled={loading}
                  onClick={() => setPage(prevPage => prevPage + 1)}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductListPage
