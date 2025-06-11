import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const EditProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { axios } = useAppContext();
    const { product } = location.state || {};

    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description.join('\n'));
            setCategory(product.category);
            setPrice(product.price);
            setOfferPrice(product.offerPrice);
            setExistingImages(product.image);
        } else {
            navigate('/seller/product-list');
        }
    }, [product, navigate]);

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();

            const productData = {
                name,
                description: description.split('\n'),
                category,
                price,
                offerPrice
            }

            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i])
            }

            const { data } = await axios.put(`/api/product/${product._id}`, formData)

            if (data.success) {
                toast.success(data.message);
                navigate('/seller/product-list');
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">Edit Product</h2>
                <form onSubmit={onSubmitHandler} className="flex flex-col gap-6 max-w-2xl">
                    <div className="flex flex-col gap-1">
                        <label className="text-base font-medium" htmlFor="product-images">Product Images</label>
                        <div className="flex flex-wrap gap-4">
                            {existingImages.map((image, index) => (
                                <div key={index} className="border border-gray-300 rounded p-2">
                                    <img src={image} alt={`Product ${index + 1}`} className="w-24 h-24 object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <label htmlFor="upload-area" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <img src={assets.upload_area} alt="upload" className="w-8 h-8 mb-4" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                                </div>
                                <input id="upload-area" type="file" className="hidden" multiple onChange={(e) => setFiles(Array.from(e.target.files))} />
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 max-w-md">
                        <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                        <input onChange={(e) => setName(e.target.value)} value={name}
                            id="product-name" type="text" placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                    <div className="flex flex-col gap-1 max-w-md">
                        <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                        <textarea onChange={(e) => setDescription(e.target.value)} value={description}
                            id="product-description" rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here"></textarea>
                    </div>
                    <div className="w-full flex flex-col gap-1">
                        <label className="text-base font-medium" htmlFor="category">Category</label>
                        <select onChange={(e) => setCategory(e.target.value)} value={category}
                            id="category" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
                            <option value="">Select Category</option>
                            {categories.map((item, index) => (
                                <option key={index} value={item.path}>{item.path}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-5 flex-wrap">
                        <div className="flex-1 flex flex-col gap-1 w-32">
                            <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                            <input onChange={(e) => setPrice(e.target.value)} value={price}
                                id="product-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                        </div>
                        <div className="flex-1 flex flex-col gap-1 w-32">
                            <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                            <input onChange={(e) => setOfferPrice(e.target.value)} value={offerPrice}
                                id="offer-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer">Update</button>
                        <button type="button" onClick={() => navigate('/seller/product-list')} className="px-8 py-2.5 bg-gray-500 text-white font-medium rounded cursor-pointer">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProduct 