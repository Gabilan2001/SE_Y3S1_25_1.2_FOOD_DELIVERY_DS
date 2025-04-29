import React from 'react';
import banner from '../assets/c_banner.png';
import bannerMobile from '../assets/m_banner.jpeg';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';
import { Link, useNavigate } from 'react-router-dom';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();

  const handleRedirectProductListpage = (id, cat) => {
    console.log(id, cat);
    const subcategory = subCategoryData.find((sub) => {
       const filterData = sub.category.some((c) => {
         return c._id == id;
    

      });

      return filterData ? true : null;
     });
     const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;

    navigate(url);
     console.log(url);
  };

  return (
    <section className="bg-white mt-24">
      <div className="container mx-auto">
        <div
          className={`w-full h-full min-h-48 bg-blue-100 rounded ${!banner && 'animate-pulse my-2'}`}
        >
          <img src={banner} className="w-full h-full hidden lg:block" alt="banner" />
          <img src={bannerMobile} className="w-full h-full lg:hidden" alt="banner" />
        </div>
      </div>

      <div className="container mx-auto px-4 my-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {loadingCategory ? (
          new Array(12).fill(null).map((_, index) => (
            <div
              key={index + 'loadingcategory'}
              className="bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse"
            >
              <div className="bg-blue-100 min-h-24 rounded"></div>
              <div className="bg-blue-100 h-8 rounded"></div>
            </div>
          ))
        ) : (
          categoryData.map((cat) => (
            <div
              key={cat._id + 'displayCategory'}
              className="w-full h-full flex flex-col items-center justify-center"
              onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
            >
              <div className="w-32 h-32 bg-gray-100 rounded overflow-hidden">
                <img
                  src={cat.image}
                  className="w-full h-full object-cover"
                  alt={cat.name}
                />
              </div>
              <div className="mt-2 text-center text-sm font-medium text-gray-700">
                {cat.name}
              </div>
            </div>
          ))
        )}
      </div>

      {/***display category product */}
      {
        categoryData.map((c,index)=>{
          return(
           // <CategoryWiseProductDisplay key={c?._id+"CategoryWiseProduct"} id={"c._id"} name={c?.name}/>
           <CategoryWiseProductDisplay key={c?._id + "CategoryWiseProduct"} id={c?._id} name={c?.name} />


          )
        })
      }
    </section>
  );
};

export default Home;
